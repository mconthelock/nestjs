import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    Logger,
    ServiceUnavailableException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, Like, QueryRunner } from 'typeorm';
import { PILINE_EVENT_RECORD } from 'src/common/Entities/workload/table/PILINE_EVENT_RECORD.entity';
import { PILINE_NG_RECORD } from 'src/common/Entities/workload/table/PILINE_NG_RECORD.entity';
import { PILINE_ATT } from 'src/common/Entities/workload/table/PILINE_ATT.entity';
import { PILINE_MAPPING_MST } from 'src/common/Entities/workload/table/PILINE_MAPPING_MST.entity';
import { PILINE_LOCATION_MST } from 'src/common/Entities/workload/table/PILINE_LOCATION_MST.entity';
import { PILINE_CAUSE_MST } from 'src/common/Entities/workload/table/PILINE_CAUSE_MST.entity';
import { PILINE_PROBLEM_MST } from 'src/common/Entities/workload/table/PILINE_PROBLEM_MST.entity';
import { PILINE_INITIAL_MST } from 'src/common/Entities/workload/table/PILINE_INITIAL_MST.entity';
import { PILINE_SECTION_MST } from 'src/common/Entities/workload/table/PILINE_SECTION_MST.entity';
import { PILINE_EVENT_MST } from 'src/common/Entities/workload/table/PILINE_EVENT_MST.entity';
import { SavePilineEventInputDto } from './dto/SAVE-PILINE_EVENT_INPUT.dto';
import { PilineEventFilesService, PilineStagedFiles } from './PILINE_EVENT_FILES.service';

export interface PilineInputFiles {
    eventFiles?: Express.Multer.File[];
    ngFiles?: Express.Multer.File[];
}

@Injectable()
export class PilineEventInputService {
    private readonly logger = new Logger(PilineEventInputService.name);
    constructor(
        @InjectDataSource('workloadConnection') private readonly ds: DataSource,
        private readonly files: PilineEventFilesService,
    ) {}

    private async lock(runner: QueryRunner) {
        if (this.ds.options.type === 'oracle') {
            // Locks cover an empty month too. Row locks on MAX(...) do not protect first inserts.
            for (let attempt = 0; ; attempt++) {
                try {
                    await runner.query(
                        'LOCK TABLE WORKLOAD.PILINE_EVENT_RECORD IN EXCLUSIVE MODE NOWAIT',
                    );
                    return;
                } catch (error) {
                    if (
                        (error.driverError?.errorNum ?? error.errorNum) !==
                            54 ||
                        attempt >= 4
                    )
                        throw error;
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
            }
        }
        if (this.ds.options.type === 'mysql') {
            const rows = await runner.query(
                "SELECT GET_LOCK('piline_event_record_save', 5) AS ACQUIRED",
            );
            if (Number(rows[0]?.ACQUIRED) !== 1)
                throw new ConflictException(
                    'Another record is being saved. Please retry.',
                );
            return;
        }
        throw new BadRequestException(
            'PILINE input supports Oracle and MySQL connections',
        );
    }

    private async validateMasters(
        manager: EntityManager,
        dto: SavePilineEventInputDto,
    ) {
        const checks: [any, object][] = [
            [
                PILINE_LOCATION_MST,
                { LOCATION_ID: dto.LOCATION_ID, STATUS: '1' },
            ],
            [PILINE_CAUSE_MST, { CAUSE_ID: dto.CAUSE_ID, STATUS: '1' }],
            [PILINE_PROBLEM_MST, { PROBLEM_ID: dto.PROBLEM_ID, STATUS: '1' }],
            [PILINE_INITIAL_MST, { INITIAL_ID: dto.INITIAL_ID, STATUS: '1' }],
            [PILINE_SECTION_MST, { SSECCODE: dto.SSECCODE }],
        ];
        for (const [entity, where] of checks) {
            if (!(await manager.getRepository(entity).existsBy(where)))
                throw new BadRequestException(
                    `Invalid or inactive ${entity.name}`,
                );
        }
        const mapping = await manager
            .getRepository(PILINE_MAPPING_MST)
            .findOneBy({
                LOCATION_ID: dto.LOCATION_ID,
                CAUSE_ID: dto.CAUSE_ID,
                PROBLEM_ID: dto.PROBLEM_ID,
                STATUS: '1',
            });
        if (
            !mapping ||
            !(await manager
                .getRepository(PILINE_EVENT_MST)
                .existsBy({ EVENT_ID: mapping.EVENT_ID, STATUS: '1' }))
        )
            throw new BadRequestException(
                'No active event mapping for the selected location, cause and problem',
            );
    }

    async save(dto: SavePilineEventInputDto, uploads: PilineInputFiles, editNumber?: string) {
        if (dto.IS_NG === '1' && !dto.NG)
            throw new BadRequestException(
                'NG details are required when IS_NG is 1',
            );
        if (dto.IS_NG === '0' && (dto.NG || uploads.ngFiles?.length))
            throw new BadRequestException(
                'NG data and files are only allowed when IS_NG is 1',
            );
        const checkedFiles = this.files.validate(uploads);
        let staged: PilineStagedFiles = { attachments: [] };
        const runner = this.ds.createQueryRunner();
        let committed = false,
            commitAttempted = false,
            locked = false;
        try {
            await runner.connect();
            // Read-committed avoids a stale snapshot after waiting for the MySQL advisory lock.
            await runner.startTransaction('READ COMMITTED');
            await this.lock(runner);
            locked = true;
            const manager = runner.manager;
            await this.validateMasters(manager, dto);
            const repo = manager.getRepository(PILINE_EVENT_RECORD);
            const existing = editNumber ? await repo.findOneBy({ PILINE_NO: editNumber }) : null;
            if (editNumber && (!existing || existing.RECORD_STATUS === 'DELETE')) throw new NotFoundException('Event not found');
            if (existing?.IS_NG === '1' && existing.RECORD_STATUS === 'QC_REJECT') throw new ConflictException('QC_REJECT NG records cannot be edited');
            if (existing) {
                const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year:'numeric',month:'2-digit',day:'2-digit' }).format(existing.EVENT_DATE);
                if (date !== dto.EVENT_DATE) throw new BadRequestException('Event date cannot be changed');
            }
            let PILINE_NO: string, RUN_NO: number;
            const EVENT_DATE = existing?.EVENT_DATE || new Date(dto.EVENT_DATE + 'T00:00:00+07:00');
            if (existing) { PILINE_NO = existing.PILINE_NO; RUN_NO = existing.RUN_NO; }
            else {
            const prefix = `PI${dto.EVENT_DATE.slice(2, 4)}${dto.EVENT_DATE.slice(5, 7)}`;
            const monthly = await repo.find({
                select: { PILINE_NO: true },
                where: { PILINE_NO: Like(`${prefix}%`) },
            });
            const numbers = monthly
                .map((row) => row.PILINE_NO)
                .filter((no) => new RegExp(`^${prefix}\\d{3}$`).test(no))
                .map((no) => Number(no.slice(-3)));
            const sequence = Math.max(0, ...numbers) + 1;
            if (sequence > 999)
                throw new ConflictException(
                    'Monthly PI Line number limit (999) reached',
                );
            PILINE_NO = prefix + String(sequence).padStart(3, '0');
            const daily = await repo
                .createQueryBuilder('record')
                .select('MAX(record.RUN_NO)', 'MAX_RUN')
                .where('record.EVENT_DATE = :date', { date: EVENT_DATE })
                .getRawOne();
            RUN_NO = Number(daily?.MAX_RUN || 0) + 1;
            if (RUN_NO > 999)
                throw new ConflictException('Daily RUN_NO limit (999) reached');
            }
            const START_TIME = new Date(
                `${dto.EVENT_DATE}T${dto.START_TIME}:00+07:00`,
            );
            const END_TIME = new Date(
                `${dto.EVENT_DATE}T${dto.END_TIME}:00+07:00`,
            );
            if (END_TIME < START_TIME)
                END_TIME.setTime(END_TIME.getTime() + 86400000);
            const record = {
                PILINE_NO,
                EVENT_DATE,
                RUN_NO,
                SHIFT: dto.SHIFT,
                START_TIME,
                END_TIME,
                LOCATION_ID: dto.LOCATION_ID,
                SSECCODE: dto.SSECCODE,
                CAUSE_ID: dto.CAUSE_ID,
                PROBLEM_ID: dto.PROBLEM_ID,
                INITIAL_ID: dto.INITIAL_ID,
                DETAIL: dto.DETAIL.trim(),
                IS_NG: dto.IS_NG,
                REMARK: dto.REMARK?.trim() || null,
                ...(existing ? { UPDATE_BY: dto.CREATE_BY.trim(), UPDATE_DATE: new Date() } : {
                    CREATE_BY: dto.CREATE_BY.trim(), CREATE_DATE: new Date(), RECORD_STATUS: 'ACTIVE',
                }),
            };
            if (existing) {
                const { PILINE_NO: _number, EVENT_DATE: _date, RUN_NO: _run, ...changes } = record;
                await repo.update({ PILINE_NO }, changes);
            } else await repo.insert(record);
            if (existing) await manager.getRepository(PILINE_NG_RECORD).delete({ PILINE_NO });
            const previousFiles = existing ? await manager.getRepository(PILINE_ATT).findBy({ PILINE_NO }) : [];
            if (previousFiles.length + checkedFiles.length > 10) throw new BadRequestException('Maximum 10 attachments including existing files');
            const maxSeq: Record<string, number> = {};
            for (const file of previousFiles) maxSeq[file.TYPEFILE] = Math.max(maxSeq[file.TYPEFILE] || 0, file.SEQ);
            staged = await this.files.stage(uploads, PILINE_NO, maxSeq);
            if (dto.IS_NG === '1')
                await manager
                    .getRepository(PILINE_NG_RECORD)
                    .insert({ ...dto.NG, PILINE_NO });
            if (staged.attachments.length)
                await manager
                    .getRepository(PILINE_ATT)
                    .insert(
                        staged.attachments.map((file) => ({
                            ...file,
                            PILINE_NO,
                        })),
                    );
            commitAttempted = true;
            await runner.commitTransaction();
            committed = true;
            return {
                status: true,
                message: 'Production event saved successfully',
                data: { ...record, attachments: staged.attachments },
            };
        } catch (error) {
            if (runner.isTransactionActive) {
                try {
                    await runner.rollbackTransaction();
                } catch (rollbackError) {
                    this.logger.error(
                        'PILINE rollback failed',
                        rollbackError.stack,
                    );
                }
            }
            if (commitAttempted)
                throw new ServiceUnavailableException(
                    'Save result is uncertain. Check the event list before submitting again.',
                );
            const code =
                error.driverError?.errorNum ??
                error.errorNum ??
                error.driverError?.errno;
            if ([1, 54, 1062].includes(code))
                throw new ConflictException(
                    'Record number is in use or another save is running. Refresh the list before retrying.',
                );
            if ([2291, 2292, 1451, 1452].includes(code))
                throw new ConflictException(
                    'Referenced master data changed. Reload the form.',
                );
            throw error;
        } finally {
            // A lost connection during COMMIT has an unknown outcome. Preserve files rather than
            // deleting attachments that may already be referenced by a committed record.
            if (!committed && !commitAttempted)
                await this.files.cleanup(staged);
            if (!committed && commitAttempted)
                this.logger.error(
                    `PILINE commit outcome unknown; verify database before removing files: ${staged.directory || '(no attachments)'}`,
                );
            if (locked && this.ds.options.type === 'mysql') {
                try {
                    await runner.query(
                        "SELECT RELEASE_LOCK('piline_event_record_save')",
                    );
                } catch (error) {
                    this.logger.error(
                        'PILINE lock release failed',
                        error.stack,
                    );
                }
            }
            try {
                await runner.release();
            } catch (error) {
                this.logger.error(
                    'PILINE connection release failed',
                    error.stack,
                );
            }
        }
    }
}
