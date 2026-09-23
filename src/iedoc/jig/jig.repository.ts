import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, getMetadataArgsStorage } from 'typeorm';
import { AMECUSERALL } from 'src/common/Entities/amec/views/AMECUSERALL.entity';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';
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
    JigNgDto,
    CreateJigDetailDto,
} from './dto/jig-form.dto';
import { ReplaceCheckpointsDto } from './dto/checkpoint.dto';
import {
    FORM_KEYS,
    formKey,
    compareReference,
    masterReference,
    nextRound,
    overallResult,
    validateRange,
    jigSnapshot,
    checkpointResult,
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

    getDashboardMaster(): Promise<(JigMaster & { SNAME: string | null })[]> {
        // IEDOC does not register AMEC's relation graph. Resolve the cross-schema
        // view from its existing entity without loading unrelated repositories.
        const employee = getMetadataArgsStorage().tables.find((table) => table.target === AMECUSERALL,)!;
        const employeePath = [employee.schema, employee.name].filter(Boolean).join('.');
        return this.getRepository(JigMaster)
            .createQueryBuilder('J')
            .select('J.*')
            .addSelect('U.SNAME', 'SNAME')
            .leftJoin(
                (query) => query
                    .select('E.SEMPNO', 'SEMPNO')
                    .addSelect('E.SNAME', 'SNAME')
                    .from(employeePath, 'E'),
                'U',
                'TRIM(U.SEMPNO) = TRIM(J.PIC_EMPNO)',
            )
            .where('J.JIG_STATUS = :status', { status: 'ACTIVE' })
            .orderBy('J.NEXT_INSPEC_DATE', 'ASC')
            .addOrderBy('J.JIG_NO', 'ASC')
            .getRawMany<JigMaster & { SNAME: string | null }>();
    }

    getFormStates(jigNo?: string,manager = this.manager,): Promise<JigFormState[]> {
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
            where: { JIG_NO: jigNo }, lock: { mode: 'pessimistic_write' },
        });
        if (!jig) throw new NotFoundException('Jig not found');
        return jig;
    }

    private async webformStatus(manager: EntityManager, key: JigFormKeyDto, lock = false,): Promise<string> {
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
        if (!['0', '1'].includes(status)) throw new ConflictException('Only a prepared or running form can be edited',);
    }

    async replaceCheckpoints(jigNo: string, dto: ReplaceCheckpointsDto) {
        dto.CHECKPOINTS.forEach(validateRange);
        return this.iedocDs.transaction(async (manager) => {
            await this.lockMaster(manager, jigNo);
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
        if ((!jigNo && dto.FORM_TYPE !== 'CREATE') || (jigNo && jigNo.length > 20)) throw new BadRequestException('JIG_NO must contain 1 to 20 characters',);
        const key = formKey(dto);
        return this.iedocDs.transaction(async (manager) => {
            // A new jig has no master row to lock. Serialize registrations so two
            // WEBFORM keys cannot register the same JIG_NO concurrently.
            if (dto.FORM_TYPE === 'CREATE') {
                this.assertEditable(await this.webformStatus(manager, key, true),);
                await manager.query('LOCK TABLE JIG_FORM IN SHARE ROW EXCLUSIVE MODE',);
                if (!jigNo) {
                    const currentYear = new Intl.DateTimeFormat('en-US', {
                        timeZone: 'Asia/Bangkok', year: '2-digit',
                    }).format(new Date());
                    const prefix = 'J' + currentYear + '-';
                    const values = await manager.query(
                        "SELECT NVL(MAX(TO_NUMBER(SUBSTR(JIG_NO, 5))), 0) AS LAST_NO FROM (SELECT JIG_NO FROM JIG_MASTER UNION ALL SELECT JIG_NO FROM JIG_FORM) WHERE REGEXP_LIKE(JIG_NO, :1)",
                        ['^' + prefix + '[0-9]{3}$'],
                    );
                    const next = Number(values[0].LAST_NO) + 1;
                    if (next > 999) throw new ConflictException('JIG running number exceeds 999 for this year');
                    jigNo = prefix + String(next).padStart(3, '0');
                }
            }
            const jig = await manager.findOne(JigMaster, {
                where: { JIG_NO: jigNo },
                ...(dto.FORM_TYPE === 'INSPECTION' ? { lock: { mode: 'pessimistic_write' as const } } : {}),
            });
            if (dto.FORM_TYPE === 'INSPECTION')
                this.assertEditable(await this.webformStatus(manager, key, true),);
            if (await manager.findOneBy(JigForm, key)) throw new ConflictException('This WEBFORM key is already linked',);
            if (dto.FORM_TYPE === 'CREATE' && jig && !['DRAFT', 'PENDING'].includes(jig.JIG_STATUS)) throw new ConflictException('Jig is already registered');
            if (dto.FORM_TYPE === 'INSPECTION' &&(!jig || jig.JIG_STATUS !== 'ACTIVE')) throw new ConflictException('INSPECTION requires an active jig',);
            const snapshot = jigSnapshot(jig ?? { REV: '0' }, dto);
            this.validateRevision(snapshot.REV, !!jig);
            if (dto.FORM_TYPE === 'CREATE' && !snapshot.START_USE_DATE)throw new BadRequestException('START_USE_DATE is required for CREATE',);
            if (dto.FORM_TYPE === 'INSPECTION' && !jig.NEXT_INSPEC_DATE)throw new ConflictException('Missing master inspection schedule',);
            const forms = await this.getFormStates(jigNo, manager);
            // The master has only a two-column reference. Never allow an ambiguous
            // pair, even if the remaining WEBFORM key columns differ.
            if (forms.some((f) => compareReference(f, key) >= 0))
                throw new ConflictException('Use a newer CYEAR2/NRUNNO pair for this jig',);
            const reference = masterReference(jig);
            if (reference && compareReference(key, reference) <= 0)
                throw new ConflictException('The new form must follow the applied master reference',);
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
                throw new ConflictException('Finish or reject the previous form before opening another round',);
            if (dto.DETAILS != null && dto.CHECKPOINTS != null)
                throw new BadRequestException('Send DETAILS or CHECKPOINTS, not both',);
            const points: CreateJigDetailDto[] = dto.DETAILS ?? dto.CHECKPOINTS ?? (jig ? await this.getCheckpoints(jigNo, manager) : []);
            if (!points.length)
                throw new BadRequestException('Nonempty DETAILS (or CHECKPOINTS) are required for a new jig',);
            points.forEach(validateRange);
            const hasNg = dto.NG != null || points.some((p) => checkpointResult(p) === 'NG');
            if (hasNg && !dto.PICCODE?.trim())
                throw new BadRequestException('PICCODE is required when the form has NG');
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
                    MEASURED_VALUE: p.MEASURED_VALUE ?? null,
                    RESULT: checkpointResult(p),
                })),
            );
            await this.writeFormExtras(
                manager,
                key,
                dto.FILES,
                dto.NG,
                dto.CREATE_BY,
                true,
            );
            await this.configureCreateFlow(manager, key, hasNg, dto.PICCODE);
            return this.getForm(key, manager);
        });
    }

    private async configureCreateFlow(manager: EntityManager, key: JigFormKeyDto, hasNg: boolean, picCode?: string) {
        // Resolve the existing entity without registering WEBFORM's relation graph
        // in IEDOC. All writes use the same connection and create transaction.
        const table = getMetadataArgsStorage().tables.find((t) => t.target === FLOW)!;
        const path = [table.schema, table.name].filter(Boolean).join('.');
        const where = FORM_KEYS.map((k, i) => k + ' = :' + (i + 1)).join(' AND ');
        const params = FORM_KEYS.map((k) => key[k]);
        if (hasNg) {
            const updateWhere = FORM_KEYS.map((k, i) => k + ' = :' + (i + 3)).join(' AND ');
            await manager.query(
                `UPDATE ${path} SET VAPVNO = :1, VREPNO = :2 WHERE ${updateWhere} AND CSTEPNO = '07'`,
                [picCode.trim(), picCode.trim(), ...params],
            );
        } else {
            await manager.query(`DELETE FROM ${path} WHERE ${where} AND CSTEPNO = '07'`, params);
            await manager.query(`UPDATE ${path} SET CSTEPNEXTNO = '04' WHERE ${where} AND CSTEPNO = '06'`, params);
        }
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
            if (dto.REPLACE_DETAILS) {
                if (!dto.DETAILS?.length) throw new BadRequestException('At least one checkpoint is required');
                await manager.delete(JigFormDetail, where);
            }
            if (dto.REPLACE_FILES) {
                if (!dto.FILES?.length) throw new BadRequestException('At least one attachment is required');
                await manager.delete(JigFormFile, where);
            }
            const details = await manager.findBy(JigFormDetail, where);
            for (const input of dto.DETAILS ?? []) {
                let row = details.find((d) => d.CHECK_SEQ === input.CHECK_SEQ);
                if (!row) {
                    if (!input.CHECK_POINT)
                        throw new BadRequestException(
                            'A new CHECK_SEQ requires CHECK_POINT',
                        );
                    row = manager.create(JigFormDetail, {
                        ...where,
                        CHECK_SEQ: input.CHECK_SEQ,
                        CHECK_POINT: input.CHECK_POINT,
                        INSPECTION_TOOL: null,
                        MIN: null,
                        MAX: null,
                        UNIT: null,
                        MEASURED_VALUE: null,
                        RESULT: null,
                    });
                    details.push(row);
                }
                for (const field of [
                    'CHECK_POINT',
                    'INSPECTION_TOOL',
                    'MIN',
                    'MAX',
                    'UNIT',
                    'MEASURED_VALUE',
                    'RESULT',
                ] as const) {
                    if (input[field] !== undefined)
                        Object.assign(row, { [field]: input[field] });
                }
                row.RESULT = checkpointResult(row);
            }

            const snapshot = jigSnapshot(form, dto);
            this.validateRevision(snapshot.REV, !!_jig);
            Object.assign(form, snapshot);
            if (dto.DETAILS?.length) await manager.save(JigFormDetail, details);
            await manager.save(JigForm, form);
            await this.writeFormExtras(
                manager,
                where,
                dto.FILES,
                dto.NG,
                dto.UPDATE_BY,
            );
            return this.getForm(where, manager);
        });
    }

    private async writeFormFile(
        manager: EntityManager,
        key: JigFormKeyDto,
        dto: JigFileDto,
        actor?: string,
        insertOnly = false,
    ) {
        const where = { ...formKey(key), FILE_SEQ: dto.FILE_SEQ };
        const existing = insertOnly
            ? null
            : await manager.findOneBy(JigFormFile, where);
        const data = manager.create(JigFormFile, {
            ...where,
            FILE_NAME: dto.FILE_NAME,
            FILE_PATH: dto.FILE_PATH,
            FILE_TYPE:
                dto.FILE_TYPE !== undefined
                    ? dto.FILE_TYPE
                    : (existing?.FILE_TYPE ?? null),
            FILE_SIZE:
                dto.FILE_SIZE !== undefined
                    ? dto.FILE_SIZE
                    : (existing?.FILE_SIZE ?? null),
            CREATE_BY: existing?.CREATE_BY ?? dto.CREATE_BY ?? actor ?? null,
            CREATE_DATE: existing?.CREATE_DATE ?? new Date(),
        });
        if (insertOnly) {
            await manager.insert(JigFormFile, data);
            return data;
        }
        return manager.save(JigFormFile, data);
    }

    private async writeFormExtras(
        manager: EntityManager,
        key: JigFormKeyDto,
        files: JigFileDto[] | undefined,
        ng: JigNgDto | null | undefined,
        actor?: string,
        insertOnly = false,
    ) {
        const where = formKey(key);
        if (ng === null) {
            if (!insertOnly) await manager.delete(JigFormNg, where);
        } else if (ng !== undefined) {
            const data = manager.create(JigFormNg, {
                ...where,
                DEFECT_DETAIL: ng.DEFECT_DETAIL,
                ACTION: ng.ACTION,
                CORRECTIVE: ng.CORRECTIVE,
                PLAN_DATE: new Date(ng.PLAN_DATE),
                LOCATION: ng.LOCATION ?? null,
            });
            if (insertOnly) await manager.insert(JigFormNg, data);
            else await manager.save(JigFormNg, data);
        }
        for (const file of files ?? [])
            await this.writeFormFile(manager, where, file, actor, insertOnly);
    }

    async putFile(key: JigFormKeyDto, dto: JigFileDto) {
        return this.withForm(key, async (manager, _form, _jig, status) => {
            this.assertEditable(status);
            return this.writeFormFile(manager, key, dto);
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
        return this.applyForm(key, updateBy, true);
    }

    private validateRevision(revision: string | null, hasMaster: boolean) {
        if (!revision?.trim()) throw new BadRequestException('REV is required');
        if (!hasMaster && revision !== '0')
            throw new BadRequestException('A new jig must start with REV 0');
        if (hasMaster && ['0', '*'].includes(revision))
            throw new BadRequestException('An existing jig requires a revised REV');
    }

    // For a caller that has already handled the finish condition.
    // Kept separate from the existing HTTP finish endpoint's workflow check.
    async applyFormToMaster(key: JigFormKeyDto, updateBy?: string) {
        return this.applyForm(key, updateBy, false);
    }

    private async applyForm(key: JigFormKeyDto, updateBy: string | undefined, requireFinished: boolean) {
        return this.withForm(key, async (manager, form, jig, status) => {
            if (!['CREATE', 'INSPECTION'].includes(form.FORM_TYPE))
                throw new ConflictException('Unsupported form type');
            if (requireFinished && status !== '2')
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
            const revision = String(form.REV ?? '').trim();
            if (!revision)
                throw new ConflictException('REV is required to apply the form');
            const isNew = revision === '0';
            if (isNew && jig)
                throw new ConflictException('REV 0 requires a new JIG_NO');
            if (revision === '*') throw new ConflictException('REV * is not supported; a new jig starts at 0');
            if (!isNew && !jig)
                throw new ConflictException('A revised form requires an existing jig');
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
            if (isNew) {
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
            else await manager.update(JigMaster, { JIG_NO: form.JIG_NO }, {
                ...snapshot,
                JIG_STATUS: jig.JIG_STATUS,
                NEXT_INSPEC_DATE: next,
                REF_CYEAR2: form.CYEAR2,
                REF_NRUNNO: form.NRUNNO,
                UPDATE_BY: jig.UPDATE_BY,
                UPDATE_DATE: jig.UPDATE_DATE,
            });
            const existingPoints = isNew ? [] : await this.getCheckpoints(form.JIG_NO, manager);
            for (const d of details) {
                const point = {
                    JIG_NO: form.JIG_NO,
                    CHECK_SEQ: d.CHECK_SEQ,
                    CHECK_POINT: d.CHECK_POINT,
                    INSPECTION_TOOL: d.INSPECTION_TOOL,
                    MIN: d.MIN,
                    MAX: d.MAX,
                    UNIT: d.UNIT,
                };
                if (existingPoints.some((p) => p.CHECK_SEQ === d.CHECK_SEQ)) {
                    await manager.update(JigCheckpoint, {
                        JIG_NO: form.JIG_NO, CHECK_SEQ: d.CHECK_SEQ,
                    }, { ...point, UPDATE_BY: updateBy ?? null, UPDATE_DATE: new Date() });
                } else {
                    await manager.insert(JigCheckpoint, {
                        ...point, CREATE_BY: updateBy ?? null, CREATE_DATE: new Date(),
                        UPDATE_BY: null, UPDATE_DATE: null,
                    });
                }
            }
            // Retire removed template points without touching form history.
            for (const point of existingPoints) {
                if (!details.some((d) => d.CHECK_SEQ === point.CHECK_SEQ))
                    await manager.delete(JigCheckpoint, {
                        JIG_NO: form.JIG_NO, CHECK_SEQ: point.CHECK_SEQ,
                    });
            }
            return { applied: true, jig };
        });
    }
}
