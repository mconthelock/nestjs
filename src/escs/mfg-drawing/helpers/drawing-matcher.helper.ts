import { Injectable } from '@nestjs/common';
import { ITEM_MFG_LIST } from 'src/common/Entities/escs/table/ITEM_MFG_LIST.entity';
import { S011MP } from 'src/common/Entities/datacenter/table/S011MP.entity';
import { DrawingParserHelper } from './drawing-parser.helper';

@Injectable()
export class DrawingMatcherHelper {
    constructor(
        private readonly parser: DrawingParserHelper,
    ) {}

    /**
     * Match drawing with master data.
     * @since 2026-03-21
     * @param dwg is value drawing GL, (E.g. ['BA105A280', 'G01', 'L21', 'L85', 'L92'])
     * @param masterDwg is master drawing with separated G and L, (E.g. { DRAWING: 'BA105A280', G: ['G01'], L: [['L21'], ['L85'], ['L92']] })
     * @returns number of matching steps
     * @example
     * matchDrawing(['BA105A280', 'G01', 'L21', 'L85', 'L92'], { DRAWING: 'BA105A280', G: ['G01'], L: [['L21'], ['L85'], ['L92']] }) => 5
     * matchDrawing(['BA105A280', 'G01', 'L21', 'L85'], { DRAWING: 'BA105A280', G: ['G01'], L: [['L21'], ['L85'], ['L92']] }) => 4
     */
    private matchDrawing(
        dwg: string[],
        masterDwg: { DRAWING: string; G: string[]; L: string[][] },
    ): number {
        let step = 0;

        // 1. check DRAWING
        if (dwg[0] !== masterDwg.DRAWING) return 0;
        step++;

        // 2. check G (ตำแหน่งที่ 1)
        if (masterDwg.G.length > 0) {
            if (!dwg[1] || !masterDwg.G.includes(dwg[1])) {
                return 0;
            }
            step++;
        }

        // 3. check L (ตำแหน่งต่อไป)
        for (let i = 0; i < masterDwg.L.length; i++) {
            const dwgIndex = i + 2; // offset
            const lGroup = masterDwg.L[i];

            if (!dwg[dwgIndex] || !lGroup.includes(dwg[dwgIndex])) {
                return 0;
            }
            step++;
        }

        return step;
    }

    /**
     * Read master data for check sheet.
     * @param list
     * @returns {
     *   VDRAWING: { DRAWING: string, G: string[], L: string[][] },
     *   VNUMBER_FILE: string
     * }[]
     * @description แปลงข้อมูลจาก ITEM_MFG_LIST ให้เหลือแค่ VDRAWING ที่ถูกแยกตัวอักษร G และ L ออกจากกัน และ VNUMBER_FILE
     * @example
     * readMaster(list) => [
     *   {
     *     VDRAWING: { DRAWING: 'BA105A280', G: ['G01'], L: [['L21'], ['L85'], ['L92']] },
     *     VNUMBER_FILE: 'file1'
     *   }
     * ]
     */
    readMaster(list: ITEM_MFG_LIST[]): {
        VDRAWING: { DRAWING: string; G: string[]; L: string[][] };
        VNUMBER_FILE: string;
    }[] {
        const mapList = list
            .filter((l) => l.NSTATUS == 1)
            .map((l) => ({
                VDRAWING: this.parser.explodeGL(l.VDRAWING),
                VNUMBER_FILE: l.VNUMBER_FILE,
            }));

        return mapList;
    }

    /**
     * Get data list of check sheet.
     * @param list
     * @param col VNUMBER_FILE or VDRAWING
     * @param drawing BA105A280 G01L21L85L92
     * @returns
     * @example
     * getDataListOfCS(list, 'BA105A280 G01L21L85L92') =>
     * { VDRAWING: { DRAWING: 'BA105A280', G: ['G01'], L: [['L21'], ['L85'], ['L92']] }, VNUMBER_FILE: 'file1' }
     */
    getDataListOfCS(
        list: ITEM_MFG_LIST[],
        drawing: string,
    ): {
        VDRAWING: { DRAWING: string; G: string[]; L: string[][] };
        VNUMBER_FILE: string;
    } {
        let res: any = [];
        if (drawing) {
            let cStepMatch: number = 0;
            const master = this.readMaster(list);

            // Set dwg from "general part list" to variable array.
            const dwg = this.parser.extractDrawing(drawing);
            for (let i = 0; i < master.length; i++) {
                const masterDwg = master[i].VDRAWING;
                const cStepTemp = this.matchDrawing(dwg, masterDwg);
                if (cStepTemp !== 0) {
                    if (cStepTemp === cStepMatch) {
                        throw new Error(
                            `Multiple matching drawings found in Master for drawing ${drawing}`,
                        );
                    }

                    if (cStepTemp > cStepMatch) {
                        cStepMatch = cStepTemp;
                        res = master[i];
                    }
                }
            }
        }

        if (!res || res.length === 0) {
            throw new Error(
                `No matching drawing found in Master for drawing ${drawing}`,
            );
        }

        return res;
    }

    /**
     * Check if a drawing should be deleted based on the delete list.
     * @param deleteDwg ['BA212B768 G01 L03~L05', ...]
     * @param drawing 'BA212B768 G01L03L04L05'
     * @returns boolean
     * @description เปรียบเทียบ drawing กับ delete list โดยแยกตัวอักษร G และ L ออกจากกัน แล้วตรวจสอบว่า drawing มีค่า G และ L ที่ตรงกับ delete list หรือไม่ โดยที่ถ้า delete list มี G01 L03~L05 จะถือว่า G01L03L04L05 ตรงกับ delete list และควรจะถูกลบ
     * @example
     * checkDeleteDrawing(['BA212B768 G01 L03~L05'], 'BA212B768 G01L03') => true
     * checkDeleteDrawing(['BA212B768 G01 L03~L05'], 'BA212B768 G06') => false
     */
    checkDeleteDrawing(deleteDwg: string[], drawing: string): boolean {
        if (!drawing) return false;

        const master = deleteDwg.map((d) => ({
            VDRAWING: this.parser.explodeGL(d),
        }));

        const dwg = this.parser.extractDrawing(drawing);

        for (const m of master) {
            const masterDwg = m.VDRAWING;

            const match = this.matchDrawing(dwg, masterDwg);

            const totalStep =
                1 + (masterDwg.G.length > 0 ? 1 : 0) + masterDwg.L.length;

            if (match === totalStep) {
                return true;
            }
        }

        return false;
    }
}