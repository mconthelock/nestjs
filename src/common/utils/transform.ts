import { Transform } from 'class-transformer';
import { formatDate } from './dayjs.utils';

export function ToBoolean() {
    return Transform(({ value }) => {
        if (
            value === true ||
            value === 'true' ||
            value === 1 ||
            value === '1'
        ) {
            return true;
        }

        if (
            value === false ||
            value === 'false' ||
            value === 0 ||
            value === '0'
        ) {
            return false;
        }

        return value; // ปล่อยให้ validator จัดการ
    });
}

export function StringToDate() {
    return Transform(({ value }) => {
        if (typeof value !== 'string') return value;

        // YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            const [y, m, d] = value.split('-').map(Number);
            return new Date(y, m - 1, d);
        }

        // YYYY-MM-DDTHH:mm:ss
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value)) {
            const [datePart, timePart] = value.split('T');
            const [y, m, d] = datePart.split('-').map(Number);
            const [hh, mm, ss] = timePart.split(':').map(Number);

            return new Date(y, m - 1, d, hh, mm, ss);
        }

        return value; // ปล่อยให้ IsDate fail
    });
}

export interface IlogMessage {
    DATE: string;
    MESSAGE: string;
    ERROR: boolean;
}

export function log_message(message: string, type = 'info'): IlogMessage {
    return {
        DATE: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        MESSAGE: message,
        ERROR: type == 'error' ? true : false,
    };
}
