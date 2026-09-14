import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { JigMaster } from 'src/common/Entities/iedoc/table/jig_master.entity';
import { JigCheckpoint } from 'src/common/Entities/iedoc/table/jig_checkpoint.entity';
import { JigForm } from 'src/common/Entities/iedoc/table/jig_form.entity';
import { JigFormDetail } from 'src/common/Entities/iedoc/table/jig_form_detail.entity';
import { JigFormNg } from 'src/common/Entities/iedoc/table/jig_form_ng.entity';
import { JigFormFile } from 'src/common/Entities/iedoc/table/jig_form_file.entity';
import {
    CreateJigFormDto,
    JigFormKeyDto,
    SaveJigFormDto,
    JigFileDto,
} from './dto/jig-form.dto';
import { ReplaceCheckpointsDto } from './dto/checkpoint.dto';
import {
    FORM_KEYS,
    formKey,
    monthStart,
    monthKey,
    nextRound,
    overallResult,
    validateRange,
} from './jig.utils';

export type JigFormState = JigForm & { FORM_STATUS: string | null };

@Injectable()
export class JigRepository extends BaseRepository {
    constructor(
        @InjectDataSource('iedocConnection')
        private readonly iedocDs: DataSource,
    ) {
        super(iedocDs);
    }

    findMaster(jigNo: string) {
        return this.getRepository(JigMaster).findOneBy({ JIG_NO: jigNo });
    }

    async createMaster(data: Partial<JigMaster>) {
        try {
            await this.getRepository(JigMaster).insert(data);
        } catch (error) {
            if (error.errorNum === 1 || error.code === 'ORA-00001')
                throw new ConflictException('JIG_NO already exists');
            throw error;
        }
        return this.findMaster(data.JIG_NO);
    }

    getDashboardMaster(): Promise<
        (JigMaster & {
            PIC_NAME: string;
            PIC_SECTION: string;
            CHECKPOINT_COUNT: number;
        })[]
    > {
        return this.manager.query(
            'SELECT J.*, U.SNAME AS PIC_NAME, U.SSEC AS PIC_SECTION, ' +
                '(SELECT COUNT(*) FROM JIG_CHECKPOINT C WHERE C.JIG_NO = J.JIG_NO) AS CHECKPOINT_COUNT ' +
                'FROM JIG_MASTER J LEFT JOIN AMEC.AMECUSERALL U ON TRIM(U.SEMPNO) = TRIM(J.PIC_EMPNO) ' +
                'ORDER BY J.NEXT_INSPEC_DATE ASC, J.JIG_NO ASC',
        );
    }

    getFormStates(
        jigNo?: string,
        manager = this.manager,
    ): Promise<JigFormState[]> {
        return manager.query(
            'SELECT F.*, W.CST AS FORM_STATUS FROM JIG_FORM F LEFT JOIN WEBFORM.FORM W ON ' +
                FORM_KEYS.map((k) => 'W.' + k + ' = F.' + k).join(' AND ') +
                (jigNo !== undefined ? ' WHERE F.JIG_NO = :1' : '') +
                ' ORDER BY F.CREATE_DATE DESC',
            jigNo !== undefined ? [jigNo] : [],
        );
    }

    getCheckpoints(jigNo: string, manager = this.manager) {
        return manager.find(JigCheckpoint, {
            where: { JIG_NO: jigNo },
            order: { CHECK_SEQ: 'ASC' },
        });
    }

    private async lockMaster(manager: EntityManager, jigNo: string) {
        const jig = await manager.findOne(JigMaster, {
            where: { JIG_NO: jigNo },
            lock: { mode: 'pessimistic_write' },
        });
        if (!jig) throw new NotFoundException('Jig not found');
        return jig;
    }

    private async webformStatus(
        manager: EntityManager,
        key: JigFormKeyDto,
        lock = false,
    ): Promise<string> {
        // Read the real workflow state, never accept approval from the request body.
        const rows = await manager.query(
            'SELECT CST FROM WEBFORM.FORM WHERE ' +
                FORM_KEYS.map((k, i) => k + ' = :' + (i + 1)).join(' AND ') +
                (lock ? ' FOR UPDATE' : ''),
            FORM_KEYS.map((k) => key[k]),
        );
        if (!rows.length) throw new NotFoundException('WEBFORM.FORM not found');
        return String(rows[0].CST).trim();
    }

    private assertEditable(status: string) {
        if (!['0', '1'].includes(status))
            throw new ConflictException(
                'Only a prepared or running form can be edited',
            );
    }

    async updateMaster(jigNo: string, changes: Partial<JigMaster>) {
        return this.iedocDs.transaction(async (manager) => {
            const jig = await this.lockMaster(manager, jigNo);
            const forms = await this.getFormStates(jigNo, manager);
            if (
                forms.some(
                    (f) => !['2', '3'].includes(String(f.FORM_STATUS).trim()),
                )
            ) {
                throw new ConflictException(
                    'Master cannot be changed while a form is pending',
                );
            }
            const periodChanged =
                changes.INSPEC_PERIOD !== undefined &&
                Number(changes.INSPEC_PERIOD) !== Number(jig.INSPEC_PERIOD);
            const scheduleChanged =
                changes.NEXT_INSPEC_DATE !== undefined &&
                (changes.NEXT_INSPEC_DATE?.getTime() ?? null) !==
                    (jig.NEXT_INSPEC_DATE?.getTime() ?? null);
            if (forms.length && (periodChanged || scheduleChanged)) {
                throw new ConflictException(
                    'Schedule and period cannot be edited after forms exist',
                );
            }
            if (
                changes.JIG_STATUS &&
                changes.JIG_STATUS !== jig.JIG_STATUS &&
                ['DRAFT', 'PENDING', 'ACTIVE'].includes(changes.JIG_STATUS)
            ) {
                throw new ConflictException(
                    'Registration status is controlled by CREATE form approval',
                );
            }
            Object.assign(jig, changes, { UPDATE_DATE: new Date() });
            return manager.save(JigMaster, jig);
        });
    }

    async replaceCheckpoints(jigNo: string, dto: ReplaceCheckpointsDto) {
        dto.CHECKPOINTS.forEach(validateRange);
        return this.iedocDs.transaction(async (manager) => {
            await this.lockMaster(manager, jigNo);
            const forms = await this.getFormStates(jigNo, manager);
            if (
                forms.some(
                    (f) => !['2', '3'].includes(String(f.FORM_STATUS).trim()),
                )
            )
                throw new ConflictException(
                    'Cannot replace checkpoints while a form is pending',
                );
            await manager.delete(JigCheckpoint, { JIG_NO: jigNo });
            const points = dto.CHECKPOINTS.map((p) => ({
                ...p,
                JIG_NO: jigNo,
                CREATE_BY: dto.UPDATE_BY ?? null,
                CREATE_DATE: new Date(),
                UPDATE_BY: null,
                UPDATE_DATE: null,
            }));
            if (points.length) await manager.insert(JigCheckpoint, points);
            return this.getCheckpoints(jigNo, manager);
        });
    }

    async createForm(jigNo: string, dto: CreateJigFormDto) {
        const key = formKey(dto);
        return this.iedocDs.transaction(async (manager) => {
            const jig = await this.lockMaster(manager, jigNo);
            this.assertEditable(await this.webformStatus(manager, key, true));
            if (await manager.findOneBy(JigForm, key))
                throw new ConflictException(
                    'This WEBFORM key is already linked',
                );
            if (
                dto.FORM_TYPE === 'CREATE' &&
                !['DRAFT', 'PENDING'].includes(jig.JIG_STATUS)
            )
                throw new ConflictException('CREATE requires a draft jig');
            if (dto.FORM_TYPE === 'INSPECTION' && jig.JIG_STATUS !== 'ACTIVE')
                throw new ConflictException(
                    'INSPECTION requires an active jig',
                );
            const schedule = jig.NEXT_INSPEC_DATE
                ? monthStart(jig.NEXT_INSPEC_DATE)
                : null;
            if (!schedule)
                throw new ConflictException(
                    'Set NEXT_INSPEC_DATE before creating a form',
                );
            if (dto.FORM_TYPE === 'INSPECTION' && !dto.SCHEDULE_DATE)
                throw new BadRequestException(
                    'An inspection requires its original SCHEDULE_DATE',
                );
            if (
                dto.SCHEDULE_DATE &&
                (!schedule ||
                    monthKey(monthStart(dto.SCHEDULE_DATE)) !==
                        monthKey(schedule))
            )
                throw new ConflictException(
                    'SCHEDULE_DATE does not match the master due month',
                );
            const forms = await this.getFormStates(jigNo, manager);
            if (
                forms.some(
                    (f) =>
                        String(f.FORM_STATUS).trim() !== '3' &&
                        f.FORM_TYPE === dto.FORM_TYPE &&
                        (dto.FORM_TYPE === 'CREATE' ||
                            (f.SCHEDULE_DATE &&
                                monthKey(monthStart(f.SCHEDULE_DATE)) ===
                                    monthKey(schedule))),
                )
            ) {
                throw new ConflictException(
                    'A non-rejected form already exists for this round',
                );
            }
            const points = await this.getCheckpoints(jigNo, manager);
            if (!points.length)
                throw new ConflictException(
                    'Define checkpoints before creating a form',
                );
            const form = manager.create(JigForm, {
                ...key,
                JIG_NO: jigNo,
                FORM_TYPE: dto.FORM_TYPE,
                SCHEDULE_DATE: schedule,
                CHECK_DATE: dto.CHECK_DATE ? new Date(dto.CHECK_DATE) : null,
                INSPECTOR_EMPNO: dto.INSPECTOR_EMPNO ?? null,
                OVERALL_RESULT: null,
                CREATE_BY: dto.CREATE_BY ?? null,
                CREATE_DATE: new Date(),
                UPDATE_BY: null,
                UPDATE_DATE: null,
            });
            await manager.insert(JigForm, form);
            await manager.insert(
                JigFormDetail,
                points.map((p) => ({
                    ...key,
                    CHECK_SEQ: p.CHECK_SEQ,
                    CHECK_POINT: p.CHECK_POINT,
                    INSPECTION_TOOL: p.INSPECTION_TOOL,
                    MIN: p.MIN,
                    MAX: p.MAX,
                    UNIT: p.UNIT,
                    MEASURED_VALUE: null,
                    RESULT: null,
                    UPDATE_BY: null,
                    UPDATE_DATE: null,
                })),
            );
            if (dto.FORM_TYPE === 'CREATE') {
                jig.JIG_STATUS = 'PENDING';
                jig.UPDATE_BY = dto.CREATE_BY ?? null;
                jig.UPDATE_DATE = new Date();
                await manager.save(JigMaster, jig);
            }
            return this.getForm(key, manager);
        });
    }

    async getForm(key: JigFormKeyDto, manager = this.manager) {
        const where = formKey(key);
        const form = await manager.findOneBy(JigForm, where);
        if (!form) throw new NotFoundException('Jig form not found');
        const [details, ng, files, status] = await Promise.all([
            manager.find(JigFormDetail, { where, order: { CHECK_SEQ: 'ASC' } }),
            manager.findOneBy(JigFormNg, where),
            manager.find(JigFormFile, { where, order: { FILE_SEQ: 'ASC' } }),
            this.webformStatus(manager, where),
        ]);
        return {
            ...form,
            FORM_STATUS: status,
            DETAILS: details,
            NG: ng,
            FILES: files,
        };
    }

    private async withForm<T>(
        key: JigFormKeyDto,
        callback: (
            manager: EntityManager,
            form: JigForm,
            jig: JigMaster,
            status: string,
        ) => Promise<T>,
    ) {
        const where = formKey(key);
        return this.iedocDs.transaction(async (manager) => {
            const form = await manager.findOneBy(JigForm, where);
            if (!form) throw new NotFoundException('Jig form not found');
            const jig = await this.lockMaster(manager, form.JIG_NO);
            const status = await this.webformStatus(manager, where, true);
            const currentForm = await manager.findOneBy(JigForm, where);
            return callback(manager, currentForm, jig, status);
        });
    }

    async saveForm(key: JigFormKeyDto, dto: SaveJigFormDto) {
        return this.withForm(key, async (manager, form, _jig, status) => {
            this.assertEditable(status);
            const where = formKey(key);
            const details = await manager.findBy(JigFormDetail, where);
            for (const input of dto.DETAILS) {
                const row = details.find(
                    (d) => d.CHECK_SEQ === input.CHECK_SEQ,
                );
                if (!row)
                    throw new BadRequestException(
                        'Unknown CHECK_SEQ in form snapshot',
                    );
                if (input.MEASURED_VALUE !== undefined)
                    row.MEASURED_VALUE = input.MEASURED_VALUE;
                if (input.RESULT !== undefined) row.RESULT = input.RESULT;
                if (
                    row.MEASURED_VALUE != null &&
                    (row.MIN != null || row.MAX != null)
                ) {
                    row.RESULT =
                        (row.MIN != null && row.MEASURED_VALUE < row.MIN) ||
                        (row.MAX != null && row.MEASURED_VALUE > row.MAX)
                            ? 'NG'
                            : 'OK';
                }
                row.UPDATE_BY = dto.UPDATE_BY ?? null;
                row.UPDATE_DATE = new Date();
            }
            if (details.length) await manager.save(JigFormDetail, details);
            form.OVERALL_RESULT = overallResult(details);
            if (dto.CHECK_DATE !== undefined)
                form.CHECK_DATE = dto.CHECK_DATE
                    ? new Date(dto.CHECK_DATE)
                    : null;
            if (dto.INSPECTOR_EMPNO !== undefined)
                form.INSPECTOR_EMPNO = dto.INSPECTOR_EMPNO;
            form.UPDATE_BY = dto.UPDATE_BY ?? null;
            form.UPDATE_DATE = new Date();
            await manager.save(JigForm, form);
            if (dto.NG === null || form.OVERALL_RESULT === 'OK') {
                await manager.delete(JigFormNg, where);
            } else if (dto.NG !== undefined) {
                const existing = await manager.findOneBy(JigFormNg, where);
                await manager.save(JigFormNg, {
                    ...existing,
                    ...where,
                    ...dto.NG,
                    PLAN_DATE: new Date(dto.NG.PLAN_DATE),
                    CREATE_BY: existing?.CREATE_BY ?? dto.UPDATE_BY ?? null,
                    CREATE_DATE: existing?.CREATE_DATE ?? new Date(),
                    UPDATE_BY: dto.UPDATE_BY ?? null,
                    UPDATE_DATE: new Date(),
                });
            }
            return this.getForm(where, manager);
        });
    }

    async putFile(key: JigFormKeyDto, dto: JigFileDto) {
        return this.withForm(key, async (manager, _form, _jig, status) => {
            this.assertEditable(status);
            const where = { ...formKey(key), FILE_SEQ: dto.FILE_SEQ };
            const existing = await manager.findOneBy(JigFormFile, where);
            return manager.save(JigFormFile, {
                ...existing,
                ...dto,
                ...where,
                CREATE_BY: existing?.CREATE_BY ?? dto.CREATE_BY ?? null,
                CREATE_DATE: existing?.CREATE_DATE ?? new Date(),
            });
        });
    }

    async deleteFile(key: JigFormKeyDto, fileSeq: number) {
        return this.withForm(key, async (manager, _form, _jig, status) => {
            this.assertEditable(status);
            const result = await manager.delete(JigFormFile, {
                ...formKey(key),
                FILE_SEQ: fileSeq,
            });
            if (!result.affected)
                throw new NotFoundException('Attachment not found');
            return { deleted: true };
        });
    }

    async finishForm(key: JigFormKeyDto, updateBy?: string) {
        return this.withForm(key, async (manager, form, jig, status) => {
            if (status !== '2')
                throw new ConflictException(
                    'The WEBFORM approval flow is not complete',
                );
            const details = await manager.findBy(JigFormDetail, formKey(key));
            if (
                !form.CHECK_DATE ||
                !form.INSPECTOR_EMPNO ||
                !details.length ||
                details.some(
                    (d) =>
                        !['OK', 'NG'].includes(d.RESULT) ||
                        ((d.MIN != null || d.MAX != null) &&
                            d.MEASURED_VALUE == null),
                )
            ) {
                throw new ConflictException(
                    'Inspection date, inspector and all checkpoint results are required',
                );
            }
            const result = overallResult(details);
            if (result !== form.OVERALL_RESULT)
                throw new ConflictException(
                    'Overall result does not match checkpoint results',
                );
            if (
                result === 'NG' &&
                !(await manager.findOneBy(JigFormNg, formKey(key)))
            )
                throw new ConflictException(
                    'NG result requires corrective action details',
                );
            if (form.FORM_TYPE === 'CREATE') {
                if (jig.JIG_STATUS === 'ACTIVE') return { applied: false, jig };
                if (!['DRAFT', 'PENDING'].includes(jig.JIG_STATUS))
                    throw new ConflictException(
                        'Jig cannot be activated from its current status',
                    );
                if (!jig.NEXT_INSPEC_DATE)
                    throw new ConflictException(
                        'Set a first inspection schedule before registration approval',
                    );
                jig.JIG_STATUS = 'ACTIVE';
            } else {
                if (jig.JIG_STATUS !== 'ACTIVE')
                    throw new ConflictException('Jig is not active');
                if (!form.SCHEDULE_DATE || !jig.NEXT_INSPEC_DATE)
                    throw new ConflictException('Missing inspection schedule');
                const due = monthStart(jig.NEXT_INSPEC_DATE);
                const scheduled = monthStart(form.SCHEDULE_DATE);
                const next = nextRound(scheduled, jig.INSPEC_PERIOD);
                if (due >= next) return { applied: false, jig };
                if (due.getTime() !== scheduled.getTime())
                    throw new ConflictException(
                        'The approved form does not match the current due round',
                    );
                jig.NEXT_INSPEC_DATE = next;
            }
            jig.UPDATE_BY = updateBy ?? null;
            jig.UPDATE_DATE = new Date();
            await manager.save(JigMaster, jig);
            return { applied: true, jig };
        });
    }
}
