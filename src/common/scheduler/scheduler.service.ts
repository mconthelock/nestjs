import {
  Injectable,
  OnModuleInit,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';

import { ScheduledJob } from './entities/scheduled-job.entity';
import { JobExecutionLog } from './entities/job-log.entity';
import { CreateJobDto } from './dto/create-scheduler.dto';

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

  // --- CRUD & Management ---
  async createJob(dto: CreateJobDto) {
    const newJob = this.jobRepo.create({
      ...dto,
      IS_ACTIVE: 1,
    });
    const savedJob = await this.jobRepo.save(newJob);
    this.addCronJob(savedJob);
    return savedJob;
  }

  async findAllJobs() {
    return this.jobRepo.find();
  }

  async getLogs(jobId?: string) {
    if (jobId) {
      return this.logRepo.find({
        where: { job: { ID: jobId } },
        order: { START_TIME: 'DESC' },
        take: 100,
      });
    }
    return this.logRepo.find({
      order: { START_TIME: 'DESC' },
      take: 100,
    });
  }

  async manualTrigger(id: string) {
    const job = await this.jobRepo.findOneBy({ ID: id });
    if (!job) throw new NotFoundException('Job not found');
    this.handleJobExecution(job);
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

  async handleJobExecution(job: ScheduledJob) {
    const lockKey = `lock:job:${job.ID}:${new Date().getMinutes()}`;
    const ttl = 55;

    const acquired = await this.redisClient.set(
      lockKey,
      'locked',
      'EX',
      ttl,
      'NX',
    );
    if (!acquired) return;

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
        startTime,
        endTime,
        durationMs: endTime.getTime() - startTime.getTime(),
        status,
        responseCode,
        outputMessage: message,
      });
      await this.jobRepo.update(job.ID, { LAST_RUN_AT: endTime });
    }
  }
}
