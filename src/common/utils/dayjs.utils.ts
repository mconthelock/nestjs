import * as dayjsModule from 'dayjs';

// ดึง default ถ้ามี ไม่งั้นใช้ตัว module ตรง ๆ
const dayjs = (dayjsModule as any).default ?? (dayjsModule as any);

/**
 * Get fiscal year
 * @since 2026-01-23
 * @author Sutthipong tangmongkhoncharoen
 * @param {number} month
 * @param {number} year
 * @returns {string} fiscal year
 * @example
 * getFYear(3, 2024) // returns 2023
 * getFYear(5, 2024) // returns 2024
 */
export function getFYear({
    month,
    year,
}: { month?: number; year?: number } = {}): number {
    month = month ?? new Date().getMonth() + 1;
    year = year ?? new Date().getFullYear();
    if (month < 4) {
        return (year -= 1);
    } else {
        return year;
    }
}

/**
 * Format a date string.
 * @param {string} date
 * @param {string} format
 * @returns {string}
 */
export function formatDate(
    date: string | Date | number,
    format: string = 'YYYY-MM-DD',
    locale: string = 'en',
): string {
    if (!date) return '';
    if (typeof date === 'number') {
        return dayjs(String(date), 'YYYYMMDD').format(format);
    }
    return dayjs(date).locale(locale).format(format);
}

export function now(
    format: string = 'YYYY-MM-DD',
    locale: string = 'en',
): string {
    return dayjs().locale(locale).format(format);
}

function utcToBangkokDate(date: Date): Date {
    console.log('date', date);

    return dayjs(date).locale('en');
}

const DATE_FORMATS = [
    'D-MMM-YY',
    'D-MMM-YYYY',
    'DD-MMM-YY',
    'DD-MMM-YYYY',
    'D/MMM/YY',
    'D/MMM/YYYY',
    'YYYY-MM-DD',
    'YYYY/MM/DD',
    'DD/MM/YYYY',
    'D/M/YYYY',
];

export function toExcelDate(
    input: string | Date | number,
    numFmt: string = '',
): Date | string | null {
    if (!input) return null;
    if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
    if (typeof input === 'number') {
        const d = new Date(input);
        return isNaN(d.getTime()) ? null : d;
    }
    if (typeof input === 'string') {
        const s = input.trim();

        // หา format ที่ตรงกับที่กำหนดไว้
        for (const fmt of DATE_FORMATS) {
            const d = dayjs.utc(s, fmt, 'en', true); // true = strict
            // 🔥 ถ้าเป็น ISO 8601
            if (/Z$/.test(s)) {
                const d = dayjs.utc(s).add(7, 'hour');
                return d.toDate();
            }
            if (d.isValid()) {
                // หากได้วันที่ที่ถูกต้อง
                // ถ้า format มีชั่วโมง นาที วินาที ให้ตั้งเป็น UTC แบบเต็ม ไม่งั้นจะเป็นแค่วันที่
                if (
                    numFmt.toLowerCase().includes('h') ||
                    numFmt.toLowerCase().includes('m') ||
                    numFmt.toLowerCase().includes('s')
                ) {
                    return new Date(
                        Date.UTC(
                            d.year(),
                            d.month(),
                            d.date(),
                            d.hour(),
                            d.minute(),
                            d.second(),
                        ),
                    );
                } else {
                    return new Date(Date.UTC(d.year(), d.month(), d.date()));
                }
            }
        }
        // เผื่อ format แปลก ๆ ก็ให้โอกาส JS parse ปกติเป็น fallback
        const d2 = new Date(s);
        return isNaN(d2.getTime()) ? null : d2;
    }
    return null;
}
