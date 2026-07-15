import { Injectable } from '@nestjs/common';

@Injectable()
export class DrawingParserHelper {

    /**
     * Extract drawing from string.
     * @since 2026-03-21
     * @param drawing BA105A280 G01L21L85L92
     * @returns [ 'BA105A280', 'G01', 'L21', 'L85', 'L92' ]
     * @description แยกตัวอักษร G และ L ออกจาก string drawing และ return เป็น array โดยแยก G และ L ออกจากกัน
     * @example
     * extractDrawing('BA105A280 G01L21L85L92') => [ 'BA105A280', 'G01', 'L21', 'L85', 'L92' ]
     */
    extractDrawing(drawing: string): string[] {
        const split = drawing.split(' ');
        const dwg: string[] = [split[0]];
        if (split[1]) {
            const gl = this.splitGPL(split[1]);
            dwg.push(...gl);
        }

        return dwg;
    }

    /**
     * Set value G and L to checkSheet file.
     * @since 2026-03-20
     * @param {string} drawing is value drawing GL, (E.g. 'G01L01')
     * @return {string[]} is value GL, (E.g. ['G01', 'L01'])
     * @example
     * splitGPL('G01L01') => ['G01', 'L01']
     */
    splitGPL(drawing: string): string[] {
        const regex = /[GL-]{1}\d{2,3}/g;
        const matches = drawing.match(regex);
        return matches || [];
    }

    /**
     * Set value G and L.
     * @since 2026-03-20
     * @param  {string} drawing is 'BS123A571 G01 L12~L14'
     * @return {object} is { DRAWING: string, G: string[], L: string[] }
     * @example
     * explodeGL('BS123A571 G01 L01~L04 L12~L14') => { DRAWING: 'BS123A571', G: ['G01'], L: [['L01', 'L02', 'L03', 'L04'], ['L12', 'L13', 'L14']] }
     */
    explodeGL(drawing: string): {
        DRAWING: string;
        G: string[];
        L: string[][];
    } {
        // replace space ซ้ำให้เหลือช่องเดียว
        drawing = this.expandGLRange(drawing);
        const split: string[] = drawing.split(' ');
        const parsed = this.parseGLSegments(split);
        return {
            DRAWING: split[0],
            G: parsed.G,
            L: parsed.L,
        };
    }

    /**
     * Expand GL range in the drawing string.
     * @since 2026-03-21
     * @param drawing BS123A571 G01 L12~L14
     * @returns BS123A571 G01 L12L13L14
     * @description แปลงช่วงของ G และ L ที่มีรูปแบบเป็น G01~G05 หรือ L01~L04 ให้กลายเป็น G01G02G03G04G05 หรือ L01L02L03L04 โดยที่ยังคงรูปแบบเดิมของ string ไว้
     * @example
     * expandGLRange('BS123A571 G01 L01~L04 L12~L14') => 'BS123A571 G01 L01L02L03L04 L12L13L14'
     * expandGLRange('BS123A571 G01 L01') => 'BS123A571 G01 L01'
     */
    expandGLRange(drawing: string): string {
        // replace space ซ้ำให้เหลือช่องเดียว
        drawing = drawing.replace(/\s+/g, ' ');

        const pattern = /[GL-]{1}\d{2,3}~[GL]{1}\d{2,3}/g;
        const matches = drawing.match(pattern) || [];
        matches.forEach((val) => {
            const GL  = val.split('~');
            const min = GL[0].replace(/[GL]{1}/g, '');
            const max = GL[1].replace(/[GL]{1}/g, '');
            const prefix = GL[0].replace(/\d+/g, '');
            let tmpGL = '';
            for (let i = parseInt(min); i <= parseInt(max); i++) {
                tmpGL += prefix + String(i).padStart(min.length, '0');
            }

            drawing = drawing.replace(val, tmpGL);
        });
        return drawing;
    }

    /**
     * Parse G and L segments from the split drawing string.
     * @since 2026-03-21
     * @param split ['BS123A571', 'G05', 'L20L21', 'L50L51L52']
     * @returns  { G: ['G05'], L: [['L20', 'L21'], ['L50', 'L51', 'L52']] }
     * @description แยก segment ของ G และ L ออกจากกัน โดยที่ G จะถูกเก็บใน array เดียว ส่วน L จะถูกเก็บใน array ของ array เพื่อแยกแต่ละกลุ่มของ L ออกจากกัน
     * @example
     * parseGLSegments(['BS123A571', 'G05', 'L20L21', 'L50L51L52']) => { G: ['G05'], L: [['L20', 'L21'], ['L50', 'L51', 'L52']] }
     */
    parseGLSegments(split: string[]): {
        G: string[];
        L: string[][];
    } {
        let indexL = -1;
        let checkG = false;

        const result = {
            G: [] as string[],
            L: [] as string[][],
        };

        for (let i = 1; i < split.length; i++) {
            const gl = this.splitGPL(split[i]);

            if (split[i].startsWith('L') && gl.length > 0) {
                result.L[++indexL] = gl;
            } else if (split[i].startsWith('G') && gl.length > 0) {
                if (checkG) {
                    throw new Error('Invalid format: multiple G groups found');
                }

                result.G.push(...gl);
                checkG = true;
            }
        }

        return result;
    }

    /**
     * Normalize drawing format by removing spaces before L groups.
     * @example normalizeDrawing('YA239B388')         => 'YA239B388'
     *          normalizeDrawing('YA239B388 G01')     => 'YA239B388 G01'
     *          normalizeDrawing('YA239B388 G01 L01') => 'YA239B388 G01L01'
     */
    normalizeDrawing(drawing: string): string {
        return drawing.trim().replace(/\s+(L\d+)/g, '$1');
    }

    /**
     * Extract drawing number without G/L suffix.
     *
     * @example extractDrawingNo('YA239B388 G01L01') => 'YA239B388'
     *          extractDrawingNo('YA239B388 G01')    => 'YA239B388'
     *          extractDrawingNo('YA239B388')        => 'YA239B388'
     */
    extractDrawingNo(drawing: string): string {
        return drawing.trim().split(/\s+/)[0];
    }

    /**
     * Extract process code from process number.
     * @param value Full process number (6 characters)
     * @returns Process code (last 4 characters)
     */
    extractProcessCode(value: string): string {
        if (!value || value.length !== 6) {
            throw new Error(`Process No "${value}" ไม่ถูกต้อง กรุณาตรวจสอบข้อมูลใน ID-Tag`);
            
        }

        return value.substring(2);
    }
}