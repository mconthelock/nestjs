import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { transactionContext } from 'src/common/interceptors/transaction-context';
import { FORM_KEYS, SNAPSHOT_FIELDS, compareReference, masterReference, validateRange } from './jig.utils';

export function inspectionDate(value: string): string {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value ?? '');
    if (!match) throw new BadRequestException('date must use dd/mm/yyyy');
    const [, dd, mm, yyyy] = match;
    const date = new Date(Date.UTC(+yyyy, +mm - 1, +dd));
    if (+yyyy < 1900 || +yyyy > 9998 || date.getUTCFullYear() !== +yyyy ||
        date.getUTCMonth() !== +mm - 1 || date.getUTCDate() !== +dd)
        throw new BadRequestException('Invalid calendar date');
    return `${yyyy}-${mm}-${dd}`;
}

@Injectable()
export class JigInspectionService {
    constructor(
        @InjectDataSource('webformConnection') private readonly ds: DataSource,
        private readonly forms: FormCreateService,
    ) {}

    async run(date: string, ip = '127.0.0.1') {
        const due = inspectionDate(date);
        const candidates = await this.ds.manager.query(
            "SELECT JIG_NO FROM IEDOC.JIG_MASTER WHERE JIG_STATUS = 'ACTIVE' AND TRUNC(NEXT_INSPEC_DATE) = TO_DATE(:1, 'YYYY-MM-DD') ORDER BY JIG_NO", [due]);
        const items = [];
        for (const candidate of candidates) {
            try {
                const result = await this.ds.transaction((manager) =>
                    transactionContext.run({ manager }, () => this.createOne(manager, candidate.JIG_NO, due, ip)));
                items.push({ JIG_NO: candidate.JIG_NO, ...result });
            } catch (error) {
                items.push({ JIG_NO: candidate.JIG_NO, status: 'failed', message: error.message });
            }
        }
        return { date, total: items.length,
            created: items.filter((i) => i.status === 'created').length,
            skipped: items.filter((i) => i.status === 'skipped').length,
            failed: items.filter((i) => i.status === 'failed').length, items };
    }

    private async createOne(manager: EntityManager, jigNo: string, due: string, ip: string) {
        // Serialize number allocation with other writers before reading MAX(runno).
        // Cross-schema JIG SQL uses this same WEBFORM transaction and connection.
        const masters = await manager.query(
            "SELECT * FROM IEDOC.JIG_MASTER WHERE JIG_NO = :1 AND JIG_STATUS = 'ACTIVE' AND TRUNC(NEXT_INSPEC_DATE) = TO_DATE(:2, 'YYYY-MM-DD') FOR UPDATE", [jigNo, due]);
        if (!masters.length) return { status: 'skipped', reason: 'Jig is no longer active or due on this date' };
        const master = masters[0];
        // Match approval's lock order: master first, WEBFORM second.
        await manager.query('LOCK TABLE WEBFORM.FORM IN SHARE ROW EXCLUSIVE MODE');
        const history = await manager.query(
            'SELECT F.CYEAR2, F.NRUNNO, W.CST FROM IEDOC.JIG_FORM F LEFT JOIN WEBFORM.FORM W ON ' +
            FORM_KEYS.map((k) => `W.${k} = F.${k}`).join(' AND ') + ' WHERE F.JIG_NO = :1', [jigNo]);
        const reference = masterReference(master);
        if (history.some((f) => String(f.CST).trim() !== '3' &&
            (!reference || compareReference(f, reference) > 0)))
            return { status: 'skipped', reason: 'An existing form is pending or has not been applied' };
        const pic = master.PIC_EMPNO?.trim();
        if (!pic) throw new BadRequestException('JIG_MASTER.PIC_EMPNO is required');
        if (!master.REV?.trim() || master.REV.trim() === '*')
            throw new BadRequestException('Master requires a valid REV');
        const points = await manager.query('SELECT * FROM IEDOC.JIG_CHECKPOINT WHERE JIG_NO = :1 ORDER BY CHECK_SEQ', [jigNo]);
        if (!points.length) throw new BadRequestException('Jig has no checkpoints');
        points.forEach(validateRange);
        const defects = await manager.query('SELECT * FROM IEDOC.JIG_DEFECT_NG WHERE JIG_NO = :1', [jigNo]);
        const created = await this.forms.create({ 
            NFRMNO: 31, 
            VORGNO: '051401', 
            CYEAR: '26',
            REQBY: pic, 
            INPUTBY: pic, 
            DRAFT: '0', 
            REMARK: `[Auto Created] JIG inspection ${jigNo}; due ${due}` },
            ip
        );
        if (!created?.status || !created.data) throw new Error('WEBFORM creation failed');
        const key = Object.fromEntries(FORM_KEYS.map((k) => [k, created.data[k]]));
        if (FORM_KEYS.some((k) => key[k] == null)) throw new Error('WEBFORM returned an incomplete form key');
        const previous = [...history, ...(reference ? [reference] : [])];
        if (previous.some((f) => compareReference(key as any, f) <= 0))
            throw new BadRequestException('Generated form reference must follow existing jig history');
        await this.insert(manager, 'JIG_FORM', { ...key, FORM_TYPE: 'INSPECTION', JIG_NO: jigNo, REV_OLD: master.REV ?? null,
            ...Object.fromEntries(SNAPSHOT_FIELDS.map((field) => [field, master[field] ?? null])) });
        for (const point of points) {
            await this.insert(manager, 'JIG_FORM_DETAIL', { ...key,
                ...Object.fromEntries(['CHECK_SEQ', 'CHECK_POINT', 'INSPECTION_TOOL', 'MIN', 'MAX', 'UNIT', 'MEASURED_VALUE']
                    .map((field) => [field, point[field] ?? null])), RESULT: null });
        }
        if (defects.length) {
            await this.insert(manager, 'JIG_FORM_NG', { ...key,
                ...Object.fromEntries(['DEFECT_DETAIL', 'ACTION', 'CORRECTIVE', 'PLAN_DATE', 'LOCATION']
                    .map((field) => [field, defects[0][field] ?? null])) });
            await manager.query('UPDATE WEBFORM.FLOW SET VAPVNO = :1, VREPNO = :2 WHERE ' +
                FORM_KEYS.map((k, i) => `${k} = :${i + 3}`).join(' AND ') + " AND CSTEPNO = '07'",
                [pic, pic, ...FORM_KEYS.map((k) => key[k])]);
        }
        // No files, results or master due-date updates. Preserve the workflow
        // when no old NG exists: a not-yet-inspected form is not an OK result.
        return { status: 'created', key };
    }

    private insert(manager: EntityManager, table: string, row: Record<string, unknown>) {
        const columns = Object.keys(row);
        return manager.query(`INSERT INTO IEDOC.${table} (${columns.map((c) => '"' + c + '"').join(', ')}) VALUES (${columns.map((_, i) => ':' + (i + 1)).join(', ')})`, Object.values(row));
    }
}
