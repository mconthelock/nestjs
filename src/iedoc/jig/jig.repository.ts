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
import { MachineAbilityProcess } from 'src/common/Entities/iedoc/table/machine_ability_process.entity';
import { ShopCodeMst } from 'src/common/Entities/iedoc/table/shopcodemst.entity';
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
    compareReference,
    masterReference,
    nextRound,
    overallResult,
    validateRange,
    jigSnapshot,
} from './jig.utils';

export type JigFormState = JigForm & {
    FORM_STATUS: string | null;
    FORM_DATE: Date | null;
    INPUTER: string | null;
    DETAIL_COUNT: number;
};

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

    getMfgProcesses() {
        return this.getRepository(MachineAbilityProcess).find({
            where: { STATUS: '1' },
            order: { PROCESS: 'ASC', MA_CODE: 'ASC', MID: 'ASC' },
        });
    }

    getLocations() {
        return this.getRepository(ShopCodeMst).find({
            where: { STATUS: '1' },
            order: { SHOPCODE: 'ASC' },
        });
    }

    getIePics(): Promise<
        { SEMPNO: string; SNAME: string; SPOSNAME: string | null }[]
    > {
        return this.manager.query(
            'SELECT SEMPNO, SNAME, SPOSNAME FROM AMEC.AMECUSERALL ' +
                "WHERE SDEPCODE = '051401' AND CSTATUS = '1' " +
                "AND SPOSCODE NOT IN ('30', '20', '21') " +
                'ORDER BY SNAME ASC, SEMPNO ASC',
        );
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
            'SELECT F.*, W.CST AS FORM_STATUS, W.DREQDATE AS FORM_DATE, W.VINPUTER AS INPUTER, ' +
                '(SELECT COUNT(*) FROM JIG_FORM_DETAIL D WHERE ' +
                FORM_KEYS.map((k) => 'D.' + k + ' = F.' + k).join(' AND ') +
                ') AS DETAIL_COUNT FROM JIG_FORM F LEFT JOIN WEBFORM.FORM W ON ' +
                FORM_KEYS.map((k) => 'W.' + k + ' = F.' + k).join(' AND ') +
                (jigNo !== undefined ? ' WHERE F.JIG_NO = :1' : '') +
                ' ORDER BY W.DREQDATE DESC, F.CYEAR2 DESC, F.NRUNNO DESC, F.NFRMNO, F.VORGNO, F.CYEAR',
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
        if (!jigNo || jigNo.length > 20)
            throw new BadRequestException(
                'JIG_NO must contain 1 to 20 characters',
            );
        const key = formKey(dto);
        return this.iedocDs.transaction(async (manager) => {
            // A new jig has no master row to lock. Serialize registrations so two
            // WEBFORM keys cannot register the same JIG_NO concurrently.
            if (dto.FORM_TYPE === 'CREATE') {
                this.assertEditable(
                    await this.webformStatus(manager, key, true),
                );
                await manager.query(
                    'LOCK TABLE JIG_FORM IN SHARE ROW EXCLUSIVE MODE',
                );
            }
            const jig = await manager.findOne(JigMaster, {
                where: { JIG_NO: jigNo },
                ...(dto.FORM_TYPE === 'INSPECTION'
                    ? { lock: { mode: 'pessimistic_write' as const } }
                    : {}),
            });
            if (dto.FORM_TYPE === 'INSPECTION')
                this.assertEditable(
                    await this.webformStatus(manager, key, true),
                );
            if (await manager.findOneBy(JigForm, key))
                throw new ConflictException(
                    'This WEBFORM key is already linked',
                );
            if (
                dto.FORM_TYPE === 'CREATE' &&
                jig &&
                !['DRAFT', 'PENDING'].includes(jig.JIG_STATUS)
            )
                throw new ConflictException('Jig is already registered');
            if (
                dto.FORM_TYPE === 'INSPECTION' &&
                (!jig || jig.JIG_STATUS !== 'ACTIVE')
            )
                throw new ConflictException(
                    'INSPECTION requires an active jig',
                );
            const snapshot = jigSnapshot(jig ?? {}, dto);
            if (dto.FORM_TYPE === 'CREATE' && !snapshot.START_USE_DATE)
                throw new BadRequestException(
                    'START_USE_DATE is required for CREATE',
                );
            if (dto.FORM_TYPE === 'INSPECTION' && !jig.NEXT_INSPEC_DATE)
                throw new ConflictException(
                    'Missing master inspection schedule',
                );
            const forms = await this.getFormStates(jigNo, manager);
            // The master has only a two-column reference. Never allow an ambiguous
            // pair, even if the remaining WEBFORM key columns differ.
            if (forms.some((f) => compareReference(f, key) >= 0))
                throw new ConflictException(
                    'Use a newer CYEAR2/NRUNNO pair for this jig',
                );
            const reference = masterReference(jig);
            if (reference && compareReference(key, reference) <= 0)
                throw new ConflictException(
                    'The new form must follow the applied master reference',
                );
            if (
                forms.some(
                    (f) =>
                        String(f.FORM_STATUS).trim() !== '3' &&
                        (dto.FORM_TYPE === 'CREATE' ||
                            String(f.FORM_STATUS).trim() !== '2' ||
                            !reference ||
                            compareReference(f, reference) > 0),
                )
            )
                throw new ConflictException(
                    'Finish or reject the previous form before opening another round',
                );
            const points =
                dto.CHECKPOINTS ??
                (jig ? await this.getCheckpoints(jigNo, manager) : []);
            if (!points.length)
                throw new BadRequestException(
                    'CHECKPOINTS are required for a new jig',
                );
            points.forEach(validateRange);
            const form = manager.create(JigForm, {
                ...key,
                ...snapshot,
                JIG_NO: jigNo,
                FORM_TYPE: dto.FORM_TYPE,
            });
            await manager.insert(JigForm, form);
            await manager.insert(
                JigFormDetail,
                points.map((p) => ({
                    ...key,
                    CHECK_SEQ: p.CHECK_SEQ,
                    CHECK_POINT: p.CHECK_POINT,
                    INSPECTION_TOOL: p.INSPECTION_TOOL ?? null,
                    MIN: p.MIN ?? null,
                    MAX: p.MAX ?? null,
                    UNIT: p.UNIT ?? null,
                    MEASURED_VALUE: null,
                    RESULT: null,
                })),
            );
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
            OVERALL_RESULT: overallResult(details),
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
            jig: JigMaster | null,
            status: string,
        ) => Promise<T>,
    ) {
        const where = formKey(key);
        return this.iedocDs.transaction(async (manager) => {
            const form = await manager.findOneBy(JigForm, where);
            if (!form) throw new NotFoundException('Jig form not found');
            let jig = await manager.findOne(JigMaster, {
                where: { JIG_NO: form.JIG_NO },
                lock: { mode: 'pessimistic_write' },
            });
            const status = await this.webformStatus(manager, where, true);
            if (!jig)
                jig = await manager.findOne(JigMaster, {
                    where: { JIG_NO: form.JIG_NO },
                    lock: { mode: 'pessimistic_write' },
                });
            const currentForm = await manager.findOneBy(JigForm, where);
            return callback(manager, currentForm, jig, status);
        });
    }

    async saveForm(key: JigFormKeyDto, dto: SaveJigFormDto) {
        return this.withForm(key, async (manager, form, _jig, status) => {
            this.assertEditable(status);
            const where = formKey(key);
            const details = await manager.findBy(JigFormDetail, where);
            for (const input of dto.DETAILS ?? []) {
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
            }
            if (details.length) await manager.save(JigFormDetail, details);
            const result = overallResult(details);
            Object.assign(form, jigSnapshot(form, dto));
            await manager.save(JigForm, form);
            if (dto.NG === null || result === 'OK') {
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
            if (!['CREATE', 'INSPECTION'].includes(form.FORM_TYPE))
                throw new ConflictException('Unsupported form type');
            if (status !== '2')
                throw new ConflictException(
                    'The WEBFORM approval flow is not complete',
                );
            const forms = await this.getFormStates(form.JIG_NO, manager);
            if (
                forms.some(
                    (f) =>
                        compareReference(f, form) === 0 &&
                        FORM_KEYS.some(
                            (k) =>
                                String(f[k]).trim() !== String(form[k]).trim(),
                        ),
                )
            )
                throw new ConflictException(
                    'Ambiguous form reference for this jig',
                );
            const reference = masterReference(jig);
            if (reference && compareReference(form, reference) <= 0)
                return { applied: false, jig };
            if (
                forms.some(
                    (f) =>
                        compareReference(f, form) < 0 &&
                        String(f.FORM_STATUS).trim() !== '3' &&
                        (!reference || compareReference(f, reference) > 0),
                )
            )
                throw new ConflictException(
                    'The previous form has not been applied',
                );
            const snapshot = jigSnapshot(form);
            const details = await manager.findBy(JigFormDetail, formKey(key));
            if (
                !details.length ||
                details.some(
                    (d) =>
                        !['OK', 'NG'].includes(d.RESULT) ||
                        ((d.MIN != null || d.MAX != null) &&
                            d.MEASURED_VALUE == null),
                )
            )
                throw new ConflictException(
                    'All checkpoint results and required measurements must be completed',
                );
            if (
                overallResult(details) === 'NG' &&
                !(await manager.findOneBy(JigFormNg, formKey(key)))
            )
                throw new ConflictException(
                    'NG result requires corrective action details',
                );
            let next: Date;
            if (form.FORM_TYPE === 'CREATE') {
                if (jig && !['DRAFT', 'PENDING'].includes(jig.JIG_STATUS))
                    throw new ConflictException('Jig is already registered');
                if (!snapshot.START_USE_DATE)
                    throw new ConflictException(
                        'START_USE_DATE is required for CREATE',
                    );
                next = nextRound(
                    snapshot.START_USE_DATE,
                    snapshot.INSPEC_PERIOD,
                );
            } else {
                if (
                    !jig ||
                    jig.JIG_STATUS !== 'ACTIVE' ||
                    !jig.NEXT_INSPEC_DATE
                )
                    throw new ConflictException(
                        'An active jig with an inspection schedule is required',
                    );
                // The due month is unchanged while this is the only open round.
                // Approval/check dates never shift the recurring schedule.
                next = nextRound(jig.NEXT_INSPEC_DATE, snapshot.INSPEC_PERIOD);
            }
            const isNew = !jig;
            jig = Object.assign(
                jig ??
                    manager.create(JigMaster, {
                        JIG_NO: form.JIG_NO,
                        CREATE_BY: updateBy ?? null,
                        CREATE_DATE: new Date(),
                    }),
                snapshot,
                {
                    JIG_STATUS: 'ACTIVE',
                    NEXT_INSPEC_DATE: next,
                    REF_CYEAR2: form.CYEAR2,
                    REF_NRUNNO: form.NRUNNO,
                    UPDATE_BY: updateBy ?? null,
                    UPDATE_DATE: new Date(),
                },
            );
            // INSERT prevents a different registration from overwriting a winner.
            if (isNew) await manager.insert(JigMaster, jig);
            else await manager.save(JigMaster, jig);
            await manager.delete(JigCheckpoint, { JIG_NO: form.JIG_NO });
            await manager.insert(
                JigCheckpoint,
                details.map((d) => ({
                    JIG_NO: form.JIG_NO,
                    CHECK_SEQ: d.CHECK_SEQ,
                    CHECK_POINT: d.CHECK_POINT,
                    INSPECTION_TOOL: d.INSPECTION_TOOL,
                    MIN: d.MIN,
                    MAX: d.MAX,
                    UNIT: d.UNIT,
                    CREATE_BY: updateBy ?? null,
                    CREATE_DATE: new Date(),
                    UPDATE_BY: null,
                    UPDATE_DATE: null,
                })),
            );
            return { applied: true, jig };
        });
    }
}
