export function numberToAlphabetRevision(revision: number): string {
    if (revision <= 0) return '*';
    let result = '';
    let num = revision;
    while (num > 0) {
        num--; // Adjust for 0-indexing
        result = String.fromCharCode(65 + (num % 26)) + result;
        num = Math.floor(num / 26);
    }
    return result;
}

/**
 * @author Sutthipong Tangmonkhoncharoen(24008)
 * @since 2026-06-15
 * @param {string} text รูปแบบที่รองรับคือ ขึ้นต้นด้วยตัวเลขตามด้วยตัวอักษร หรือเป็นตัวอักษรเพียงอย่างเดียว เช่น 2026041, 202604X, X, A, Y, B, Z, C
 * @returns {string | null} คืนค่าเป็นสตริงที่ถูกแปลงแล้ว หรือ null หากรูปแบบไม่ถูกต้อง
 */
export function convertJung(text: string): string | null {
    if (!text) {
        return null;
    }

    const value = text.trim().toUpperCase();
    // รองรับรูปแบบ ขึ้นต้นด้วยตัวเลขตามด้วยตัวอักษร หรือเป็นตัวอักษรเพียงอย่างเดียว
    // เช่น 2026041, 202604X, X, A, Y, B, Z, C
    const isValid = /^(\d+[1-6XAYBZC]|[1-6XAYBZC])$/.test(value);

    if (!isValid) {
        return null;
    }

    const jungMap: Record<string, string> = {
        '1': 'X',
        '2': 'A',
        '3': 'Y',
        '4': 'B',
        '5': 'Z',
        '6': 'C',
        X: '1',
        A: '2',
        Y: '3',
        B: '4',
        Z: '5',
        C: '6',
    };

    const lastChar = value.slice(-1);
    const converted = jungMap[lastChar];

    if (!converted) {
        return null;
    }

    return value.slice(0, -1) + converted;
}

/**
 * Convert float to comma.
 * @author Mr.Pathanapong Sokpukeaw
 * @since 2021-12-11
 * @param float d the value
 * @param int digit the number digit to cal
 * @param bool flage the fixed digit, true is fixed and false is not fixed
 * @return string
 */
export function setRound(
    d: number | string,
    digit: number = 2,
    flage: boolean = true,
): string {
    if (!d) {
        return flage ? (0).toFixed(digit) : '0';
    }
    flage = flage || false;
    const cDigit = Math.pow(10, digit);
    let value: string | number = d.toString();
    value = removeComma(value);
    value = Math.round(Number(value) * cDigit) / cDigit;
    if (isNaN(value)) {
        if (flage) {
            return (0).toFixed(digit);
        } else {
            return '0';
        }
    }
    if (flage) {
        value = value.toFixed(digit);
    } else {
        value = value.toString();
    }

    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

/**
 * Remove comma from string.
 * @param {string} d
 * @returns
 */
export function removeComma(d: string): string {
    return d.replace(/,/g, '');
}

/**
 * Obtain the ordinal indicator for a given number.
 * @since 2026-01-22
 * @author Sutthipong Tangmongkhoncharoen(24008)
 * @param {number} number - ตัวเลขที่ต้องการแปลงเป็นรูปแบบมีตัวบ่งชี้ลำดับ (เช่น 1, 2, 3, ...)
 * @param {boolean} supperScript - กำหนดให้ indicator เป็น superscript หรือไม่ (เช่น 1st หรือ 1<sup>st</sup>)
 * @param {boolean} upperCase - กำหนดให้ indicator เป็นตัวพิมพ์ใหญ่หรือไม่ (เช่น 1ST)
 * @returns {string} number with ordinal indicator
 * @example
 * const result = ordinalIndicator(1); // "1st"
 */
export function ordinalIndicator(
    number: number,
    supperScript: boolean = false,
    upperCase: boolean = false,
): string {
    const lastDigit: number = number % 10;
    const lastTwoDigit: number = number % 100;
    let indicator = '';
    if (lastTwoDigit >= 11 && lastTwoDigit <= 13) {
        indicator = 'th';
    } else {
        switch (lastDigit) {
            case 1:
                indicator = 'st';
                break;
            case 2:
                indicator = 'nd';
                break;
            case 3:
                indicator = 'rd';
                break;
            default:
                indicator = 'th';
                break;
        }
    }
    const finalIndicator: string = upperCase ? indicator.toUpperCase() : indicator;
    return (
        number +
        (supperScript ? `<sup>${finalIndicator}</sup>` : finalIndicator)
    );
}
