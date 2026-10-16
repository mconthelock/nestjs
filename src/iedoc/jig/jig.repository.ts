import { JigFlowService } from './jig-flow.service';
import { SaveJigRecheckDto } from './dto/jig-recheck.dto';
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
import { JigDelForm } from 'src/common/Entities/iedoc/table/jigdel_form.entity';
import { CreateJigDeleteFormDto, SaveJigDeleteFormDto } from './dto/jig-delete-form.dto';
import { JigDefectNg } from 'src/common/Entities/iedoc/table/jig_defect_ng.entity';
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
        private readonly ngFlow?: JigFlowService,
    ) {
        super(iedocDs);
    }

    findMaster(jigNo: string) {
        return this.getRepository(JigMaster).findOneBy({ JIG_NO: jigNo });
    }

    async getDeleteForm(key: JigFormKeyDto, manager = this.manager) {
        const where = formKey(key);
        const form = await manager.findOneBy(JigDelForm, where);
        if (!form) throw new NotFoundException('JIGDEL_FORM not found');
        const FILES = await manager.find(JigFormFile, { where, order: { FILE_SEQ: 'ASC' } });
        return { ...form, FILES };
    }

    private validateDeleteFiles(key: JigFormKeyDto, files?: JigFileDto[]) {
        if (files === undefined) return;
        if (!Array.isArray(files)) throw new BadRequestException('FILES must be an array');
        const folder = 'IE-DELJIG' + String(key.CYEAR2).slice(-2) + '-' + String(key.NRUNNO).padStart(6, '0');
        if (files.length > 5 || new Set(files.map(file => file.FILE_SEQ)).size !== files.length ||
            new Set(files.map(file => file.FILE_PATH)).size !== files.length)
            throw new BadRequestException('Invalid or duplicate attachment list');
        for (const file of files) {
            if (!/^[\p{L}\p{M}\p{N}_-]+\.(jpg|jpeg|png|pdf)$/iu.test(file.FILE_NAME) ||
                file.FILE_PATH !== folder + '/' + file.FILE_NAME)
                throw new BadRequestException('Attachment path does not match delete form');
        }
    }

    async saveDeleteForm(key: JigFormKeyDto, dto: SaveJigDeleteFormDto) {
        const keys = formKey(key);
        this.validateDeleteFiles(keys, dto.FILES);
        return this.iedocDs.transaction(async manager => {
            const form = await manager.findOneBy(JigDelForm, keys);
            if (!form) throw new NotFoundException('JIGDEL_FORM not found');
            const jig = await this.lockMaster(manager, form.JIG_NO);
            this.assertEditable(await this.webformStatus(manager, keys, true));
            if (jig.JIG_STATUS !== 'PENDING_DELETE') throw new ConflictException('JIG is not pending deletion');
            const where = FORM_KEYS.map((k, i) => k + ' = :' + (i + 1)).join(' AND ');
            const requester = await manager.query(
                "SELECT CSTEPNO FROM WEBFORM.FLOW WHERE " + where +
                " AND CSTEPNO = '--' AND CSTEPST = '3' AND (VAPVNO = :6 OR VREPNO = :7)",
                [...FORM_KEYS.map(k => keys[k]), dto.UPDATE_BY, dto.UPDATE_BY],
            );
            if (!requester.length) throw new ConflictException('Only requester can edit delete form');
            if (dto.REASON !== undefined) form.REASON = dto.REASON;
            if (dto.DETAIL !== undefined) form.DETAIL = dto.DETAIL;
            await manager.save(JigDelForm, form);
            // Removed attachments use the DELETE endpoint, which also removes the physical file via PHP.
            // Keep sequence numbers stable and only upsert the submitted attachments here.
            if (dto.FILES !== undefined) {
                const existing = await manager.find(JigFormFile, { where: keys });
                if (existing.some(file => !dto.FILES.some(next => next.FILE_SEQ === file.FILE_SEQ && next.FILE_PATH === file.FILE_PATH)))
                    throw new ConflictException('Attachments changed; reload the form before saving');
                for (const file of dto.FILES) await this.writeFormFile(manager, keys, file, dto.UPDATE_BY);
            }
            return this.getDeleteForm(keys, manager);
        });
    }

    async deleteDeleteFormFile(key: JigFormKeyDto, fileSeq: number) {
        const keys = formKey(key);
        return this.iedocDs.transaction(async manager => {
            const form = await manager.findOneBy(JigDelForm, keys);
            if (!form) throw new NotFoundException('JIGDEL_FORM not found');
            const jig = await this.lockMaster(manager, form.JIG_NO);
            this.assertEditable(await this.webformStatus(manager, keys, true));
            if (jig.JIG_STATUS !== 'PENDING_DELETE') throw new ConflictException('JIG is not pending deletion');
            const result = await manager.delete(JigFormFile, { ...keys, FILE_SEQ: fileSeq });
            if (!result.affected) throw new NotFoundException('Attachment not found');
            return { deleted: true };
        });
    }

    async createDeleteForm(dto: CreateJigDeleteFormDto) {
        const key = formKey(dto);
        this.validateDeleteFiles(key, dto.FILES);
        const where = FORM_KEYS.map((k, i) => `${k} = :${i + 1}`).join(' AND ');
        const values = FORM_KEYS.map((k) => key[k]);
        return this.iedocDs.transaction(async (manager) => {
            const jig = await this.lockMaster(manager, dto.JIG_NO);
            this.assertEditable(await this.webformStatus(manager, key, true));
            if (await manager.findOneBy(JigDelForm, key)) throw new ConflictException('Delete form already exists');
            if (jig.JIG_STATUS !== 'ACTIVE') throw new ConflictException('Only ACTIVE JIG can be requested for deletion');
            // Webform persists INPUTBY as VINPUTER. Use the actual form creator,
            // which can differ from the JIG's PIC.
            const creators = await manager.query(`SELECT VINPUTER FROM WEBFORM.FORM WHERE ${where}`, values);
            const inputBy = creators[0]?.VINPUTER?.trim();
            if (!inputBy) throw new BadRequestException('WEBFORM.FORM VINPUTER (INPUTBY) is required');
            const heads = await manager.query(
                'SELECT DISTINCT TRIM(HEADNO) AS HEADNO FROM WEBFORM.SEQUENCEORG WHERE EMPNO = :1 AND TRIM(HEADNO) IS NOT NULL',
                [inputBy],
            );
            if (heads.length !== 1) throw new BadRequestException('Expected exactly one HEADNO for form INPUTBY');
            const flows = await manager.query(`SELECT CSTEPNO FROM WEBFORM.FLOW WHERE ${where} AND CEXTDATA = '02' FOR UPDATE`, values);
            if (!flows.length) throw new ConflictException('Delete form FLOW with CEXTDATA 02 not found');
            const form = { ...key, JIG_NO: jig.JIG_NO, REASON: dto.REASON ?? null, DETAIL: dto.DETAIL ?? null };
            await manager.insert(JigDelForm, form);
            for (const file of dto.FILES ?? []) await this.writeFormFile(manager, key, file, undefined, true);
            // Oracle array binds follow SQL occurrence order, not placeholder numbers.
            const updateWhere = FORM_KEYS.map((k, i) => `${k} = :${i + 3}`).join(' AND ');
            await manager.query(`UPDATE WEBFORM.FLOW SET VAPVNO = :1, VREPNO = :2 WHERE ${updateWhere} AND CEXTDATA = '02'`, [heads[0].HEADNO, heads[0].HEADNO, ...values]);
            await manager.update(JigMaster, { JIG_NO: jig.JIG_NO }, { JIG_STATUS: 'PENDING_DELETE' });
            return { ...form, FILES: dto.FILES ?? [], JIG_STATUS: 'PENDING_DELETE' };
        });
    }

    async completeDeleteForm(key: JigFormKeyDto, outcome: 'finish' | 'reject') {
        const keys = formKey(key);
        return this.iedocDs.transaction(async (manager) => {
            const form = await manager.findOneBy(JigDelForm, keys);
            if (!form) throw new NotFoundException('JIGDEL_FORM not found');
            const jig = await this.lockMaster(manager, form.JIG_NO);
            const status = await this.webformStatus(manager, keys, true);
            if (status !== (outcome === 'finish' ? '2' : '3')) throw new ConflictException('WEBFORM status does not match the requested outcome');
            const target = outcome === 'finish' ? 'DELETED' : 'ACTIVE';
            if (jig.JIG_STATUS === target) return { JIG_NO: jig.JIG_NO, JIG_STATUS: target, updated: false };
            if (jig.JIG_STATUS !== 'PENDING_DELETE') throw new ConflictException('JIG is not pending deletion');
            // An old callback must not resolve a newer deletion request.
            const others = await manager.query(
                'SELECT D.NRUNNO FROM JIGDEL_FORM D JOIN WEBFORM.FORM W ON ' +
                FORM_KEYS.map((k) => `D.${k} = W.${k}`).join(' AND ') +
                ' WHERE D.JIG_NO = :1 AND NOT (' + FORM_KEYS.map((k, i) => `D.${k} = :${i + 2}`).join(' AND ') +
                ") AND (W.CST IN ('0', '1', '2') OR W.CST IS NULL)",
                [jig.JIG_NO, ...FORM_KEYS.map((k) => keys[k])],
            );
            if (others.length) throw new ConflictException('Another delete form owns this JIG deletion');
            await manager.update(JigMaster, { JIG_NO: jig.JIG_NO }, { JIG_STATUS: target });
            return { JIG_NO: jig.JIG_NO, JIG_STATUS: target, updated: true };
        });
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

    getDefectNg(jigNo: string) {
        return this.getRepository(JigDefectNg).findOneBy({ JIG_NO: jigNo });
    }

    private async findLockedMaster(manager: EntityManager, jigNo: string) {
        // JIG_NO is unique. findOne adds FETCH NEXT 1, which Oracle cannot
        // combine with FOR UPDATE. find keeps the lock without row limiting.
        const rows = await manager.find(JigMaster, {
            where: { JIG_NO: jigNo }, lock: { mode: 'pessimistic_write' },
        });
        return rows[0] ?? null;
    }

    private async lockMaster(manager: EntityManager, jigNo: string) {
        const jig = await this.findLockedMaster(manager, jigNo);
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
                MEASURED_VALUE: p.MEASURED_VALUE ?? null,
            }));
            if (points.length) await manager.insert(JigCheckpoint, points);
            return this.getCheckpoints(jigNo, manager);
        });
    }

    async createForm(jigNo: string, dto: CreateJigFormDto) {
        if (!['CREATE'].includes(dto.FORM_TYPE))
            throw new BadRequestException('createForm supports CREATE only; use auto-inspection for INSPECTION');
        if ((!jigNo && dto.FORM_TYPE !== 'CREATE') || (jigNo && jigNo.length > 20)) throw new BadRequestException('JIG_NO must contain 1 to 20 characters',);
        const key = formKey(dto);
        const saved = await this.iedocDs.transaction(async (manager) => {
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
            const jig = await manager.findOne(JigMaster, { where: { JIG_NO: jigNo } });
            if (await manager.findOneBy(JigForm, key)) throw new ConflictException('This WEBFORM key is already linked',);
            if (dto.FORM_TYPE === 'CREATE' && jig && !['DRAFT', 'PENDING'].includes(jig.JIG_STATUS)) throw new ConflictException('Jig is already registered');
            const snapshot = jigSnapshot(jig ?? { REV: '0' }, dto);
            this.validateRevision(snapshot.REV, !!jig, dto.FORM_TYPE);
            if (dto.FORM_TYPE === 'CREATE' && !snapshot.START_USE_DATE)throw new BadRequestException('START_USE_DATE is required for CREATE',);
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
                REV_OLD: snapshot.REV,
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
            return this.getForm(key, manager);
        });
        await this.configureRequesterFlow(key, dto.PICCODE);
        return saved;
    }

    async configureRequesterFlow(key: JigFormKeyDto, picCode?: string) {
        if (!this.ngFlow) throw new Error('JigFlowService is not configured');
        return this.ngFlow.configure(formKey(key), picCode);
    }

    private async assertStepActor(manager: EntityManager, key: JigFormKeyDto, actor: string, step: string) {
        if (!actor?.trim()) throw new BadRequestException('UPDATE_BY is required');
        const rows = await manager.query('SELECT CSTEPNO FROM WEBFORM.FLOW WHERE ' +
            FORM_KEYS.map((k, i) => `${k} = :${i + 1}`).join(' AND ') +
            " AND CSTEPNO = :6 AND CSTEPST = '3' AND (TRIM(VAPVNO) = :7 OR TRIM(VREPNO) = :8)",
            [...FORM_KEYS.map(k => key[k]), step, actor.trim(), actor.trim()]);
        if (!rows.length) throw new BadRequestException(`Only the active step ${step} approver can edit this data`);
    }

    async saveRecheck(key: JigFormKeyDto, dto: SaveJigRecheckDto) {
        return this.withForm(key, async (manager, _form, _jig, status) => {
            this.assertEditable(status);
            await this.assertStepActor(manager, key, dto.UPDATE_BY, '19');
            const where = formKey(key);
            const ng = await manager.findOneBy(JigFormNg, where);
            if (!ng) throw new BadRequestException('This form has no NG');
            if (!dto.SUMMARY_DETAIL?.trim() || dto.SUMMARY_DETAIL.trim().length > 2000)
                throw new BadRequestException('Summary Detail is required (maximum 2000 characters)');
            if (!/^\d{4}-\d{2}-\d{2}$/.test(dto.ACTUAL_FINNISH_DATE) ||
                !Number.isFinite(new Date(dto.ACTUAL_FINNISH_DATE).getTime()) ||
                new Date(dto.ACTUAL_FINNISH_DATE).toISOString().slice(0, 10) !== dto.ACTUAL_FINNISH_DATE)
                throw new BadRequestException('Invalid Action Finish Date');
            const saved = await manager.findBy(JigFormFile, where);
            for (const file of dto.FILES) {
                if (!['BEFORE', 'AFTER'].includes(file.FILE_GROUP)) throw new BadRequestException('Recheck accepts BEFORE/AFTER files only');
                const prefix = `IE-JIG${key.CYEAR2.slice(-2)}-${String(key.NRUNNO).padStart(6, '0')}/${file.FILE_GROUP}/`;
                if (!file.FILE_PATH.startsWith(prefix) || file.FILE_PATH.slice(prefix.length) !== file.FILE_NAME ||
                    !/^[\p{L}\p{M}\p{N}_-]+\.(jpe?g|png)$/iu.test(file.FILE_NAME) ||
                    !['image/jpeg','image/png'].includes(file.FILE_TYPE) || !Number.isFinite(file.FILE_SIZE) ||
                    file.FILE_SIZE < 0 || file.FILE_SIZE > 10 * 1024 * 1024)
                    throw new BadRequestException('Invalid recheck image metadata');
                const old = saved.find(f => f.FILE_SEQ === file.FILE_SEQ);
                if (old && ((old.FILE_GROUP || 'REFERENCE') !== file.FILE_GROUP || old.FILE_PATH !== file.FILE_PATH))
                    throw new ConflictException('Attachment sequence has changed; reload the form');
            }
            for (const group of ['BEFORE', 'AFTER']) {
                const files = dto.FILES.filter(f => f.FILE_GROUP === group);
                if (!files.length || files.length > 5) throw new BadRequestException(`${group} requires 1 to 5 files`);
            }
            // Existing files must be deleted explicitly through the attachment endpoint.
            if (saved.some(f => ['BEFORE','AFTER'].includes(f.FILE_GROUP) && !dto.FILES.some(x => x.FILE_SEQ === f.FILE_SEQ)))
                throw new ConflictException('Attachments have changed; reload the form');
            for (const file of dto.FILES) await this.writeFormFile(manager, where, file, dto.UPDATE_BY);
            await manager.update(JigFormNg, where, {
                ACTUAL_FINNISH_DATE: new Date(dto.ACTUAL_FINNISH_DATE), SUMMARY_DETAIL: dto.SUMMARY_DETAIL.trim(),
            });
            return this.getForm(where, manager);
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

    async getNgTagData(key: JigFormKeyDto) {
        const where = formKey(key);
        const form = await this.manager.findOneBy(JigForm, where);
        if (!form) throw new NotFoundException('Jig form not found');
        const ng = await this.manager.findOneBy(JigFormNg, where);
        if (!ng) throw new NotFoundException('This form has no NG data');
        const params = FORM_KEYS.map((k) => where[k]);
        const rows = await this.manager.query('SELECT DREQDATE FROM WEBFORM.FORM WHERE ' +
            FORM_KEYS.map((k, i) => `${k} = :${i + 1}`).join(' AND '), params);
        if (!rows.length) throw new NotFoundException('WEBFORM.FORM not found');
        const stamps = await this.manager.query(
            'SELECT F.CSTEPNO, F.CAPVSTNO, F.DAPVDATE, U.SNAME, U.SSEC FROM WEBFORM.FLOW F ' +
            'LEFT JOIN AMEC.AMECUSERALL U ON TRIM(U.SEMPNO) = COALESCE(TRIM(F.VREALAPV), TRIM(F.VAPVNO)) WHERE ' +
            FORM_KEYS.map((k, i) => `F.${k} = :${i + 1}`).join(' AND ') +
            " AND F.CSTEPNO IN ('--', '06', '07') ORDER BY F.DAPVDATE DESC NULLS LAST, F.CAPVTIME DESC NULLS LAST, F.VAPVNO", params);
        return { form, ng, checkDate: rows[0].DREQDATE, stamps };
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
            let jig = await this.findLockedMaster(manager, form.JIG_NO);
            const status = await this.webformStatus(manager, where, true);
            if (!jig)
                jig = await this.findLockedMaster(manager, form.JIG_NO);
            const currentForm = await manager.findOneBy(JigForm, where);
            return callback(manager, currentForm, jig, status);
        });
    }

    async saveForm(key: JigFormKeyDto, dto: SaveJigFormDto) {
        return this.withForm(key, async (manager, form, _jig, status) => {
            this.assertEditable(status);
            await this.assertStepActor(manager, key, dto.UPDATE_BY, '--');
            const where = formKey(key);
            if (dto.REPLACE_DETAILS) {
                if (!dto.DETAILS?.length) throw new BadRequestException('At least one checkpoint is required');
                await manager.delete(JigFormDetail, where);
            }
            if (dto.FILES?.some(f => f.FILE_GROUP && f.FILE_GROUP !== 'REFERENCE'))
                throw new BadRequestException('Use the recheck endpoint for BEFORE/AFTER files');
            const existingFiles = await manager.findBy(JigFormFile, where);
            if (dto.FILES?.some(f => existingFiles.some(old => old.FILE_SEQ === f.FILE_SEQ &&
                (old.FILE_GROUP || 'REFERENCE') !== 'REFERENCE')))
                throw new ConflictException('Attachment sequence belongs to recheck data');
            if (dto.REPLACE_FILES && !dto.FILES?.length)
                throw new BadRequestException('At least one reference attachment is required');
            // Never replace all file rows: explicit deletion preserves other groups and history.

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
            this.validateRevision(snapshot.REV, !!_jig, form.FORM_TYPE);
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
            FILE_GROUP: dto.FILE_GROUP ?? existing?.FILE_GROUP ?? 'REFERENCE',
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
            if (dto.FILE_GROUP && dto.FILE_GROUP !== 'REFERENCE') throw new BadRequestException('Use the recheck endpoint');
            const old = await manager.findOneBy(JigFormFile, { ...formKey(key), FILE_SEQ: dto.FILE_SEQ });
            if (old && (old.FILE_GROUP || 'REFERENCE') !== 'REFERENCE') throw new BadRequestException('Use the recheck endpoint');
            return this.writeFormFile(manager, key, dto);
        });
    }

    async deleteFile(key: JigFormKeyDto, fileSeq: number, actor?: string) {
        return this.withForm(key, async (manager, _form, _jig, status) => {
            this.assertEditable(status);
            const file = await manager.findOneBy(JigFormFile, { ...formKey(key), FILE_SEQ: fileSeq });
            if (file && ['BEFORE', 'AFTER'].includes(file.FILE_GROUP))
                await this.assertStepActor(manager, key, actor, '19');
            else if (actor) await this.assertStepActor(manager, key, actor, '--');
            const result = await manager.delete(JigFormFile, {
                ...formKey(key),
                FILE_SEQ: fileSeq,
            });
            if (!result.affected)
                throw new NotFoundException('Attachment not found');
            return { deleted: true };
        });
    }

    async finishForm(key: JigFormKeyDto, _updateBy?: string) {
        return this.applyForm(key, true);
    }

    private validateRevision(revision: string | null, hasMaster: boolean, formType?: string) {
        if (!revision?.trim()) throw new BadRequestException('REV is required');
        if (!hasMaster && revision !== '0')
            throw new BadRequestException('A new jig must start with REV 0');
        if (hasMaster && (revision === '*' || (revision === '0' && formType !== 'INSPECTION')))
            throw new BadRequestException('An existing jig requires a revised REV');
    }

    // For a caller that has already handled the finish condition.
    // Kept separate from the existing HTTP finish endpoint's workflow check.
    async applyFormToMaster(key: JigFormKeyDto, _updateBy?: string) {
        return this.applyForm(key, false);
    }

    private async applyForm(key: JigFormKeyDto, requireFinished: boolean) {
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
            const isNew = form.FORM_TYPE === 'CREATE' && revision === '0';
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
            const formNg = await manager.findOneBy(JigFormNg, formKey(key));
            if (formNg) {
                const recheckSteps = await manager.query('SELECT CSTEPNO FROM WEBFORM.FLOW WHERE ' +
                    FORM_KEYS.map((k, i) => `${k} = :${i + 1}`).join(' AND ') + " AND CSTEPNO = '19'",
                    FORM_KEYS.map(k => key[k]));
                if (recheckSteps.length) {
                    const evidence = await manager.findBy(JigFormFile, formKey(key));
                    if (!formNg.ACTUAL_FINNISH_DATE || !formNg.SUMMARY_DETAIL?.trim() ||
                        !['BEFORE','AFTER'].every(group => evidence.some(f => f.FILE_GROUP === group)))
                        throw new BadRequestException('Complete Action Finish Date, Summary and BEFORE/AFTER evidence before finishing');
                }
            }
            if (overallResult(details) === 'NG' && !formNg)
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
                    !['ACTIVE', 'PENDING'].includes(jig.JIG_STATUS) ||
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
                    }),
                snapshot,
                {
                    JIG_STATUS: 'ACTIVE',
                    NEXT_INSPEC_DATE: next,
                    REF_CYEAR2: form.CYEAR2,
                    REF_NRUNNO: form.NRUNNO,
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
                    MEASURED_VALUE: d.MEASURED_VALUE ?? null,
                    UNIT: d.UNIT,
                };
                if (existingPoints.some((p) => p.CHECK_SEQ === d.CHECK_SEQ)) {
                    await manager.update(JigCheckpoint, {
                        JIG_NO: form.JIG_NO, CHECK_SEQ: d.CHECK_SEQ,
                    }, point);
                } else {
                    await manager.insert(JigCheckpoint, point);
                }
            }
            // Retire removed template points without touching form history.
            for (const point of existingPoints) {
                if (!details.some((d) => d.CHECK_SEQ === point.CHECK_SEQ))
                    await manager.delete(JigCheckpoint, {
                        JIG_NO: form.JIG_NO, CHECK_SEQ: point.CHECK_SEQ,
                    });
            }
            if (formNg) {
                // Only copy NG columns, never the source form's composite key.
                await manager.save(JigDefectNg, {
                    JIG_NO: form.JIG_NO,
                    DEFECT_DETAIL: formNg.DEFECT_DETAIL,
                    ACTION: formNg.ACTION,
                    CORRECTIVE: formNg.CORRECTIVE,
                    PLAN_DATE: formNg.PLAN_DATE,
                    ACTUAL_FINNISH_DATE: formNg.ACTUAL_FINNISH_DATE,
                    SUMMARY_DETAIL: formNg.SUMMARY_DETAIL,
                });
            } else {
                // Master NG reflects the latest approved snapshot, not past defects.
                await manager.delete(JigDefectNg, { JIG_NO: form.JIG_NO });
            }
            return { applied: true, jig };
        });
    }
}
