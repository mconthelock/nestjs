import {
    Injectable,
    OnModuleInit,
    Inject,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CronJob } from 'cron';
import Redis from 'ioredis';

import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { JobExecutionLog } from 'src/common/Entities/docinv/table/job-log.entity';
import { ScheduledJob } from 'src/common/Entities/docinv/table/scheduled-job.entity';

import { CreateJobDto } from './dto/create-scheduler.dto';
import { UpdateSchedulerDto } from './dto/update-scheduler.dto';
import { SearchSchedulerDto } from './dto/search-scheduler.dto';

@Injectable()
export class SchedulerService implements OnModuleInit {
    private redisClient: Redis;

    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
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
        this.addLogCompressionJob(); // เพิ่ม cron job บีบอัด logs เก่าทุกวันเวลา 00:30
    }

    /** Cron job สำหรับบีบอัด logs เก่าอัตโนมัติ */
    private addLogCompressionJob() {
        const job = new CronJob('30 0 * * *', async () => {
            this.logger.info('Running automatic log compression...', {
                context: 'SchedulerService',
            });
            try {
                const response = await this.httpService.axiosRef.post(
                    'http://localhost:3000/logger/compress-old-logs',
                    {},
                    {
                        proxy: false, // ปิดการใช้ proxy เพื่อหลีกเลี่ยงปัญหาในบางสภาพแวดล้อม (เช่น Docker) ที่อาจทำให้การตรวจสอบ endpoint ล้มเหลวโดยไม่จำเป็น
                    },
                );
                this.logger.info(
                    `Log compression completed: ${JSON.stringify(response.data.summary)}`,
                    { context: 'SchedulerService' },
                );
            } catch (error) {
                this.logger.error(`Log compression failed: ${error.message}`, {
                    context: 'SchedulerService',
                });
            }
        });

        this.schedulerRegistry.addCronJob('log-compression', job);
        job.start();
        this.logger.info(
            'Log compression cron job registered (daily at 00:30)',
            { context: 'SchedulerService' },
        );
    }

    /*** ตรวจสอบว่า URL endpoint มีอยู่จริงหรือไม่*/
    private async validateEndpoint(url: string): Promise<boolean> {
        try {
            const fullUrl = `http://localhost:${process.env.PORT}/${url}`;
            const response = await this.httpService.axiosRef.head(fullUrl, {
                timeout: 5000,
                validateStatus: (status) => true, // ยอมรับทุก status เพื่อตรวจสอบ
                proxy: false, // ปิดการใช้ proxy เพื่อหลีกเลี่ยงปัญหาในบางสภาพแวดล้อม (เช่น Docker) ที่อาจทำให้การตรวจสอบ endpoint ล้มเหลวโดยไม่จำเป็น
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
                const fullUrl = `http://localhost:${process.env.PORT}/${url}`;
                const response = await this.httpService.axiosRef.options(
                    fullUrl,
                    {
                        timeout: 5000,
                        validateStatus: (status) => true,
                        proxy: false, // ปิดการใช้ proxy เพื่อหลีกเลี่ยงปัญหาในบางสภาพแวดล้อม (เช่น Docker) ที่อาจทำให้การตรวจสอบ endpoint ล้มเหลวโดยไม่จำเป็น
                    },
                );

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
                    `Endpoint validation failed for ${url}: ${optionsError.message}`,
                    { context: 'SchedulerService' },
                );
                return false;
            }
        }
    }

    // --- CRUD & Management ---
    async createJob(dto: CreateJobDto) {
        const cronExpression = this.normalizeCronExpression(
            dto.CRON_EXPRESSION,
        );
        this.ensureValidCronExpression(cronExpression);

        // ตรวจสอบว่า endpoint มีอยู่จริง
        const isValidEndpoint = await this.validateEndpoint(dto.URL);
        if (!isValidEndpoint) {
            throw new BadRequestException(
                `Endpoint ${dto.URL} does not exist or is not accessible. Please check the URL.`,
            );
        }

        const newJob = this.jobRepo.create({
            ...dto,
            CRON_EXPRESSION: cronExpression,
            IS_ACTIVE: 1,
        });
        const savedJob = await this.jobRepo.save(newJob);
        this.addCronJob(savedJob);
        return savedJob;
    }

    async updateJob(dto: UpdateSchedulerDto) {
        if (dto.CRON_EXPRESSION !== undefined) {
            const cronExpression = this.normalizeCronExpression(
                dto.CRON_EXPRESSION,
            );
            this.ensureValidCronExpression(cronExpression);
            dto.CRON_EXPRESSION = cronExpression;
        }

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

    async getRuntimeJobs() {
        const cronJobs = this.schedulerRegistry.getCronJobs();
        const jobs = Array.from(cronJobs.entries()).map(([name, cronJob]) => {
            let nextRunAt: string | null = null;
            let lastRunAt: string | null = null;

            try {
                // cron v4: nextDates() returns DateTime[] (luxon)
                const nextList = cronJob.nextDates(1);
                nextRunAt = nextList[0]?.toISO() ?? null;
            } catch (error) {
                nextRunAt = null;
            }

            try {
                // cron v4: lastDate() returns Date | null
                const last = cronJob.lastDate();
                lastRunAt = last ? last.toISOString() : null;
            } catch (error) {
                lastRunAt = null;
            }

            return {
                name,
                isActive: cronJob.isActive,
                cronExpression:
                    (cronJob as any)?.cronTime?.source ?? 'unknown-expression',
                lastRunAt,
                nextRunAt,
            };
        });

        return {
            total: jobs.length,
            jobs,
        };
    }

    async getLogs(dto: SearchSchedulerDto) {
        const qb = this.logRepo
            .createQueryBuilder('logs')
            .leftJoinAndSelect('logs.job', 'job');
        await applyDynamicFilters(qb, dto, 'logs');
        return qb.getMany();
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
        console.log('Jobs:', jobs.length);
        jobs.forEach((job) => {
            this.addCronJob(job);
        });
        console.log(`Job Schedule was loaded`);
    }

    private addCronJob(job: ScheduledJob) {
        const cronExpression = this.normalizeCronExpression(
            job.CRON_EXPRESSION,
        );
        if (!cronExpression) {
            this.logger.warn(
                `Skip scheduling job ${job.NAME} (${job.ID}): CRON_EXPRESSION is empty`,
                { context: 'SchedulerService' },
            );
            return;
        }

        if (!this.isValidCronExpression(cronExpression)) {
            this.logger.warn(
                `Skip scheduling job ${job.NAME} (${job.ID}): invalid cron expression "${cronExpression}"`,
                { context: 'SchedulerService' },
            );
            return;
        }

        // ป้องกันการ Duplicate name
        try {
            if (this.schedulerRegistry.doesExist('cron', job.NAME)) {
                this.schedulerRegistry.deleteCronJob(job.NAME);
            }
        } catch (e) {}

        const cronJob = new CronJob(cronExpression, async () => {
            this.logger.info(`Executing job: ${job.NAME}`, {
                context: 'SchedulerService',
            });

            await this.handleJobExecution(job);
        });

        this.schedulerRegistry.addCronJob(job.NAME, cronJob);
        cronJob.start();
        this.logger.info(`Scheduled job: ${job.NAME}`, {
            context: 'SchedulerService',
        });
        this.logger.info(`Scheduled Expression: ${job.CRON_EXPRESSION}`, {
            context: 'SchedulerService',
        });
    }

    private normalizeCronExpression(expression: string): string {
        if (!expression) {
            return '';
        }

        return expression.trim().replace(/\s+/g, ' ');
    }

    private ensureValidCronExpression(expression: string): void {
        if (!expression) {
            throw new BadRequestException('Cron expression is required');
        }

        if (!this.isValidCronExpression(expression)) {
            throw new BadRequestException(
                `Invalid cron expression: ${expression}`,
            );
        }
    }

    private isValidCronExpression(expression: string): boolean {
        try {
            // Use cron parser to validate syntax and field count.
            new CronJob(expression, () => undefined);
            return true;
        } catch (error) {
            return false;
        }
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
                this.logger.info(
                    `Job ${job.NAME} skipped - already running in another instance`,
                    { context: 'SchedulerService' },
                );
                return;
            }
        }

        this.logger.info(`Executing job: ${job.NAME}`, {
            context: 'SchedulerService',
        });
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
                this.logger.warn(
                    `Invalid JSON parameters for job ${job.NAME}`,
                    { context: 'SchedulerService' },
                );
            }

            const response = await this.httpService.axiosRef.post(
                `http://localhost:${process.env.PORT}/${job.URL}`,
                payload,
                { proxy: false },
            );
            message = JSON.stringify(response.data);
            responseCode = response.status;
            this.logger.info(`Job ${job.NAME} ${response.status}`, {
                context: 'SchedulerService',
            });
        } catch (error) {
            status = 'FAILED';
            message = error.message;
            responseCode = error.response?.status || 500;
            this.logger.error(`Job failed: ${message}`, { context: 'SchedulerService' });
            throw new Error(`Job ${job.NAME} failed: ${message}`);
        } finally {
            this.logger.info(`Job ${job.NAME} finally`, { context: 'SchedulerService' });
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
            this.logger.info(`Job ${job.NAME} insert log`, { context: 'SchedulerService' });
        }
    }
}
