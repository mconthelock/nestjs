
import * as dayjsModule from 'dayjs';

// ดึง default ถ้ามี ไม่งั้นใช้ตัว module ตรง ๆ
const dayjs = (dayjsModule as any).default ?? (dayjsModule as any);

/**
 * Format a date string.
 * @param {string} date 
 * @param {string} format 
 * @returns {string}
 */
export function formatDate(date: string | Date | number, format: string = 'YYYY-MM-DD', locale: string = 'en'): string {
    if (!date) return '';
    if (typeof date === 'number') {
        return dayjs(String(date), "YYYYMMDD").format(format);
    }
    return dayjs(date).locale(locale).format(format);
}

export function now(format: string = 'YYYY-MM-DD', locale: string = 'en'): string {
    return dayjs().locale(locale).format(format);
}


const DATE_FORMATS = [
  "D-MMM-YY", "D-MMM-YYYY",
  "DD-MMM-YY", "DD-MMM-YYYY",
  "D/MMM/YY", "D/MMM/YYYY",
  "YYYY-MM-DD", "YYYY/MM/DD",
  "DD/MM/YYYY", "D/M/YYYY",
];

export function toExcelDate(input: string | Date | number, numFmt: string = ''): Date | null {
    
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
  if (typeof input === "number") {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof input === "string") {
    const s = input.trim();
    // หา format ที่ตรงกับที่กำหนดไว้
    for (const fmt of DATE_FORMATS) {
      const d = dayjs.utc(s, fmt, "en", true); // true = strict
      if (d.isValid()) {
        // หากได้วันที่ที่ถูกต้อง
        // ถ้า format มีชั่วโมง นาที วินาที ให้ตั้งเป็น UTC แบบเต็ม ไม่งั้นจะเป็นแค่วันที่
        if(numFmt.toLowerCase().includes('h') || numFmt.toLowerCase().includes('m') || numFmt.toLowerCase().includes('s')){
            return new Date(Date.UTC(d.year(), d.month(), d.date(), d.hour(), d.minute(), d.second()));
        }else{
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
