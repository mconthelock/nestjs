import {
  Injectable,
  OnModuleInit,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { ScheduledJob } from './entities/scheduled-job.entity';
import { JobExecutionLog } from './entities/job-log.entity';
import { CreateJobDto } from './dto/create-scheduler.dto';
import { UpdateSchedulerDto } from './dto/update-scheduler.dto';
import { SearchSchedulerDto } from './dto/search-scheduler.dto';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);
  private redisClient: Redis;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private httpService: HttpService,

    @InjectRepository(ScheduledJob, 'docinvConnection')
    private readonly jobRepo: Repository<ScheduledJob>,

    @InjectRepository(JobExecutionLog, 'docinvConnection')
    private logRepo: Repository<JobExecutionLog>,
  ) {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async onModuleInit() {
    await this.loadAndScheduleJobs();
  }

  /*** ตรวจสอบว่า URL endpoint มีอยู่จริงหรือไม่*/
  private async validateEndpoint(url: string): Promise<boolean> {
    try {
      const fullUrl = `http://localhost:${process.env.PORT}${url}`;
      const response = await this.httpService.axiosRef.head(fullUrl, {
        timeout: 5000,
        validateStatus: (status) => true, // ยอมรับทุก status เพื่อตรวจสอบ
      });

      // ✅ ถือว่ามี:
      // - 200-299 (success)
      // - 401/403 (มี endpoint แต่ต้อง auth)
      // - 405 (method not allowed แต่ route มี)
      // ❌ ถือว่าไม่มี:
      // - 404 (not found)
      // - 500+ (server error)
      if (
        (response.status >= 200 && response.status < 300) ||
        response.status === 401 ||
        response.status === 403 ||
        response.status === 405
      ) {
        return true;
      }

      return false;
    } catch (error) {
      // ลอง OPTIONS method ถ้า HEAD ไม่ได้
      try {
        const fullUrl = `http://localhost:${process.env.PORT}${url}`;
        const response = await this.httpService.axiosRef.options(fullUrl, {
          timeout: 5000,
          validateStatus: (status) => true,
        });

        // ตรวจสอบ status เหมือนกับ HEAD
        if (
          (response.status >= 200 && response.status < 300) ||
          response.status === 401 ||
          response.status === 403 ||
          response.status === 405
        ) {
          return true;
        }

        return false;
      } catch (optionsError) {
        this.logger.warn(
          `Endpoint validation failed for ${url}: ${error.message}`,
        );
        return false;
      }
    }
  }

  // --- CRUD & Management ---
  async createJob(dto: CreateJobDto) {
    // ตรวจสอบว่า endpoint มีอยู่จริง
    const isValidEndpoint = await this.validateEndpoint(dto.URL);
    if (!isValidEndpoint) {
      throw new BadRequestException(
        `Endpoint ${dto.URL} does not exist or is not accessible. Please check the URL.`,
      );
    }

    const newJob = this.jobRepo.create({
      ...dto,
      IS_ACTIVE: 1,
    });
    const savedJob = await this.jobRepo.save(newJob);
    this.addCronJob(savedJob);
    return savedJob;
  }

  async updateJob(dto: UpdateSchedulerDto) {
    // ตรวจสอบว่า endpoint มีอยู่จริง
    const isValidEndpoint = await this.validateEndpoint(dto.URL);
    if (!isValidEndpoint) {
      throw new BadRequestException(
        `Endpoint ${dto.URL} does not exist or is not accessible. Please check the URL.`,
      );
    }
    const job = await this.jobRepo.findOneBy({ ID: dto.ID });
    if (!job) throw new NotFoundException('Job not found');
    await this.jobRepo.update(dto.ID, dto);
    // รีโหลด job ใหม่
    const updatedJob = await this.jobRepo.findOneBy({ ID: dto.ID });
    if (updatedJob.IS_ACTIVE) {
      this.addCronJob(updatedJob);
    } else {
      // ลบ job ออกถ้าไม่ active
      try {
        if (this.schedulerRegistry.doesExist('cron', updatedJob.NAME)) {
          this.schedulerRegistry.deleteCronJob(updatedJob.NAME);
        }
      } catch (e) {}
    }
    return updatedJob;
  }

  async findAllJobs() {
    return this.jobRepo.find();
  }

  async getLogs(dto: SearchSchedulerDto) {
    const qb = this.logRepo
      .createQueryBuilder('logs')
      .leftJoinAndSelect('logs.job', 'job');
    await applyDynamicFilters(qb, dto, 'logs');
    return qb.getMany();
    // if (jobId) {
    //   return this.logRepo.find({
    //     where: { job: { ID: jobId } },
    //     order: { START_TIME: 'DESC' },
    //     take: 100,
    //   });
    // }
    // return this.logRepo.find({
    //   order: { START_TIME: 'DESC' },
    //   take: 100,
    // });
  }

  async manualTrigger(id: string) {
    const job = await this.jobRepo.findOneBy({ ID: id });
    if (!job) throw new NotFoundException('Job not found');
    await this.handleJobExecution(job, true); // ← bypass lock สำหรับ manual trigger
    return { message: `Triggered job ${job.NAME}` };
  }

  // --- Core Scheduling Logic ---

  async loadAndScheduleJobs() {
    const jobs = await this.jobRepo.find({ where: { IS_ACTIVE: 1 } });
    jobs.forEach((job) => this.addCronJob(job));
    console.log(`Job Schedule was loaded`);
  }

  private addCronJob(job: ScheduledJob) {
    // ป้องกันการ Duplicate name
    try {
      if (this.schedulerRegistry.doesExist('cron', job.NAME)) {
        this.schedulerRegistry.deleteCronJob(job.NAME);
      }
    } catch (e) {}

    const cronJob = new CronJob(job.CRON_EXPRESSION, async () => {
      await this.handleJobExecution(job);
    });

    this.schedulerRegistry.addCronJob(job.NAME, cronJob);
    cronJob.start();
    this.logger.log(`Scheduled job: ${job.NAME}`);
  }

  async handleJobExecution(job: ScheduledJob, bypassLock: boolean = false) {
    const lockKey = `lock:job:${job.ID}:${new Date().getMinutes()}`;
    const ttl = 55;

    // ถ้าเป็น manual trigger ให้ bypass lock
    if (!bypassLock) {
      const acquired = await this.redisClient.set(
        lockKey,
        'locked',
        'EX',
        ttl,
        'NX',
      );

      if (!acquired) {
        this.logger.debug(
          `Job ${job.NAME} skipped - already running in another instance`,
        );
        return;
      }
    }

    this.logger.log(`Executing job: ${job.NAME}`);
    const startTime = new Date();
    let status = 'SUCCESS';
    let message = '';
    let responseCode = 200;

    try {
      let payload = {};
      try {
        if (job.PARAMETES) {
          payload = JSON.parse(job.PARAMETES);
        }
      } catch (e) {
        this.logger.warn(`Invalid JSON parameters for job ${job.NAME}`);
      }

      const response = await this.httpService.axiosRef.post(
        `http://localhost:${process.env.PORT}${job.URL}`,
        payload,
      );
      message = JSON.stringify(response.data);
      responseCode = response.status;
    } catch (error) {
      status = 'FAILED';
      message = error.message;
      responseCode = error.response?.status || 500;
      this.logger.error(`Job failed: ${message}`);
    } finally {
      const endTime = new Date();
      await this.logRepo.save({
        job: job,
        START_TIME: startTime,
        END_TIME: endTime,
        DURATION_MS: endTime.getTime() - startTime.getTime(),
        STATUS: status,
        RESPONSE_CODE: responseCode,
        OUTPUT_MESSAGE: message,
      });
      await this.jobRepo.update(job.ID, { LAST_RUN_AT: endTime });
    }
  }
}
