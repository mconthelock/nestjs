import { BadRequestException, ConflictException } from '@nestjs/common';
import { JigFormKeyDto } from './dto/jig-form.dto';

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
