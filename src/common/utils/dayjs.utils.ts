
import * as dayjsModule from 'dayjs';

// ดึง default ถ้ามี ไม่งั้นใช้ตัว module ตรง ๆ
const dayjs = (dayjsModule as any).default ?? (dayjsModule as any);

/**
 * Format a date string.
 * @param {string} date 
 * @param {string} format 
 * @returns {string}
 */
export function formatDate(date: string | Date | number, format: string = 'YYYY-MM-DD'): string {
    if (!date) return '';
    if (typeof date === 'number') {
        return dayjs(String(date), "YYYYMMDD").format(format);
    }
    return dayjs(date).format(format);
}

export function now(format: string = 'YYYY-MM-DD'): string {
    return dayjs().format(format);
}