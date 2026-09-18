import { BadRequestException, ConflictException } from '@nestjs/common';
import { JigFormKeyDto } from './dto/jig-form.dto';
import { JigForm } from 'src/common/Entities/iedoc/table/jig_form.entity';
import { JigMaster } from 'src/common/Entities/iedoc/table/jig_master.entity';

export const SNAPSHOT_FIELDS = [
    'JIG_NAME',
    'DWG',
    'REV',
    'JIG_QTY',
    'PRICE',
    'MAKER',
    'START_USE_DATE',
    'ITEMNO',
    'JIG_DESC',
    'PROCESS_CODE',
    'LOCATION',
    'PIC_EMPNO',
    'INSPEC_PERIOD',
    'REMARK',
] as const;

export type JigSnapshot = Pick<JigForm, (typeof SNAPSHOT_FIELDS)[number]>;

// Within one jig, a reference pair is unique and new forms are chronological.
export function compareReference(
    a: { CYEAR2: string; NRUNNO: number },
    b: { CYEAR2: string; NRUNNO: number },
): number {
    return (
        Number(a.CYEAR2) - Number(b.CYEAR2) ||
        Number(a.NRUNNO) - Number(b.NRUNNO)
    );
}

export function masterReference(
    jig: { REF_CYEAR2: string | null; REF_NRUNNO: number | null } | null,
) {
    return jig?.REF_CYEAR2 && jig.REF_NRUNNO != null
        ? { CYEAR2: jig.REF_CYEAR2.trim(), NRUNNO: Number(jig.REF_NRUNNO) }
        : null;
}

// Reconstruct completed rounds backwards from the applied master reference.
// Each applied inspection advanced the previous due month by its snapshot period.
export function inspectionTimeline<
    T extends JigForm & { FORM_STATUS: string | null },
>(jig: JigMaster, history: T[]) {
    const reference = masterReference(jig);
    let cursor = jig.NEXT_INSPEC_DATE ? monthStart(jig.NEXT_INSPEC_DATE) : null;
    return [...history]
        .sort((a, b) => compareReference(b, a))
        .map((f) => {
            let schedule: Date | null = null;
            if (f.FORM_TYPE === 'INSPECTION' && cursor) {
                const applied =
                    reference &&
                    compareReference(f, reference) <= 0 &&
                    String(f.FORM_STATUS).trim() === '2';
                if (applied) {
                    cursor = new Date(
                        cursor.getFullYear(),
                        cursor.getMonth() - Number(f.INSPEC_PERIOD),
                        1,
                    );
                    schedule = new Date(cursor);
                } else if (
                    String(f.FORM_STATUS).trim() !== '3' &&
                    (!reference || compareReference(f, reference) > 0)
                ) {
                    schedule = monthStart(jig.NEXT_INSPEC_DATE);
                }
            }
            return { ...f, SCHEDULE_DATE: schedule };
        });
}

export function snapshotChanges(value: object): Partial<JigSnapshot> {
    const changes: Partial<JigSnapshot> = {};
    for (const field of SNAPSHOT_FIELDS) {
        if (value[field] !== undefined)
            Object.assign(changes, { [field]: value[field] });
    }
    if (changes.START_USE_DATE != null) {
        const value = changes.START_USE_DATE;
        const dateOnly =
            typeof value === 'string' &&
            /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
        changes.START_USE_DATE = dateOnly
            ? new Date(
                  Number(dateOnly[1]),
                  Number(dateOnly[2]) - 1,
                  Number(dateOnly[3]),
              )
            : new Date(value);
    }
    return changes;
}

export function jigSnapshot(base: object, changes: object = {}): JigSnapshot {
    const snapshot = { ...snapshotChanges(base), ...snapshotChanges(changes) };
    if (typeof snapshot.JIG_NAME !== 'string' || !snapshot.JIG_NAME.trim())
        throw new BadRequestException(
            'JIG_NAME is required in the form snapshot',
        );
    if (
        !Number.isInteger(snapshot.INSPEC_PERIOD) ||
        snapshot.INSPEC_PERIOD < 1 ||
        snapshot.INSPEC_PERIOD > 999
    )
        throw new BadRequestException(
            'INSPEC_PERIOD must be an integer from 1 to 999 months',
        );
    for (const field of SNAPSHOT_FIELDS) {
        if (snapshot[field] === undefined)
            Object.assign(snapshot, { [field]: null });
    }
    return snapshot as JigSnapshot;
}

export const FORM_KEYS = [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const;
export const formKey = (value: JigFormKeyDto): JigFormKeyDto => ({
    NFRMNO: value.NFRMNO,
    VORGNO: value.VORGNO,
    CYEAR: value.CYEAR,
    CYEAR2: value.CYEAR2,
    NRUNNO: value.NRUNNO,
});

export function monthStart(value: string | Date): Date {
    // Date-only input represents a calendar month, not a UTC timestamp.
    if (typeof value === 'string') {
        const match = /^(\d{4})-(\d{2})/.exec(value);
        if (
            !match ||
            Number(match[1]) < 1900 ||
            Number(match[1]) > 9998 ||
            Number(match[2]) < 1 ||
            Number(match[2]) > 12
        ) {
            throw new BadRequestException(
                'Date must contain a valid ISO calendar month (1900–9998)',
            );
        }
        return new Date(Number(match[1]), Number(match[2]) - 1, 1);
    }
    if (!value || !Number.isFinite(value.getTime()))
        throw new BadRequestException('Invalid date');
    return new Date(value.getFullYear(), value.getMonth(), 1);
}

export function monthKey(value: Date): string {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-01`;
}

export function nextRound(schedule: Date, period: number): Date {
    if (!Number.isInteger(Number(period)) || period < 1 || period > 999) {
        throw new ConflictException(
            'INSPEC_PERIOD must be an integer from 1 to 999 months',
        );
    }
    const date = monthStart(schedule);
    date.setMonth(date.getMonth() + Number(period));
    if (date.getFullYear() > 9999)
        throw new ConflictException(
            'Next inspection date exceeds the supported year',
        );
    return date;
}

export function validateRange(point: {
    MIN?: number | null;
    MAX?: number | null;
}) {
    if (point.MIN != null && point.MAX != null && point.MIN > point.MAX) {
        throw new BadRequestException('MIN must not exceed MAX');
    }
}

export function overallResult(
    details: { RESULT: string | null }[],
): 'OK' | 'NG' | null {
    if (details.some((row) => row.RESULT === 'NG')) return 'NG';
    return details.length && details.every((row) => row.RESULT === 'OK')
        ? 'OK'
        : null;
}
