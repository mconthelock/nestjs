import { Injectable } from '@nestjs/common';
import { F001kpService } from 'src/datacenter/f001kp/f001kp.service';
import { GeneralPartListService } from 'src/general-part-list/general-part-list.service';
import { IdtagEfacLogService } from 'src/workload/idtag-efac-log/idtag-efac-log.service';
import { S011mpService } from 'src/datacenter/s011mp/s011mp.service';
import { F001KP } from 'src/common/Entities/datacenter/table/F001KP.entity';
import { S011MP } from 'src/common/Entities/datacenter/table/S011MP.entity';
import { IDTAG_EFAC_LOG } from 'src/common/Entities/workload/table/IDTAG_EFAC_LOG.entity';
import { DrawingParserHelper } from './drawing-parser.helper';

@Injectable()
export class DrawingResolverHelper {
    constructor(
        private readonly f001kpService: F001kpService,
        private readonly generalPartListService: GeneralPartListService,
        private readonly idtagEfacLogService: IdtagEfacLogService,
        private readonly s011mpService: S011mpService,
        private readonly parser: DrawingParserHelper,
    ) {}

    async getDrawingByControlNo(controlNo: string): Promise<string> {
        const f001kp: { status: boolean; data?: F001KP; message: string } = await this.f001kpService.findOne(controlNo);
        if (!f001kp.status) {
            throw new Error(`F001KP with control no ${controlNo} not found`);
        }

        const data = f001kp.data;
        let drawing: string = null;
        if (!data.F01R06 || data.F01R06.trim() === '') {
            if (!data.F01R05 || data.F01R05.trim() === '') {
                drawing = data.F01R04;
            } else {
                drawing = data.F01R05;
            }
        } else {
            drawing = data.F01R06;
        }

        // หาจาก General part list ด้วย order และ item ที่ได้จาก F001KP
        const order  = data.F01R07?.trim();
        const item   = data.F01R03?.trim();
        const getGpl = await this.generalPartListService.getGPL(order, item);
        if (!getGpl.status) {
            throw new Error(
                `General Part List with order ${order} and item ${item} not found`,
            );
        }

        const gpl = getGpl.data;
        const match = gpl.find((d) => {
            if (!d.DRAWING || d.DRAWING.trim() === '') {
                return false;
            }
            
            const gplDrawing = d.DRAWING.replace(/\s/g, '');
            const targetDrawing = drawing.replace(/\s/g, '');
            return (
                gplDrawing === targetDrawing ||
                gplDrawing.startsWith(targetDrawing)
            );
        });

        if (!match) {
            throw new Error(
                `No matching drawing found in General Part List for drawing ${drawing}, order ${order} and item ${item}`,
            );
        }

        return match.DRAWING;
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen (24008)
     * @since 2026-07-10
     * @description ตรวจสอบและเพิ่มข้อมูลด้านข้างให้กับ drawing ของ break assembly
     * หากพบว่าเป็น break assembly จะทำการตรวจสอบ description ของ F001KP ว่ามี (L) หรือ (R) อยู่ใน description หรือไม่ หากพบจะทำการเพิ่ม (L) หรือ (R) เข้าไปใน drawing
     * @param controlNo C60526001PH
     * @param drawing BA118A742 G03
     * @returns BA118A742(R) G03
     * @example
     * checkBreakAssyDrawing('C60526001PH', 'BA118A742 G03') => 'BA118A742(R) G03'
     * checkBreakAssyDrawing('C60526001NV', 'BA118A742 G03') => 'BA118A742(L) G03'
     * checkBreakAssyDrawing('S1909110234', 'BS127C197 G01') => 'BS127C197 G01'
     */
    async checkBreakAssyDrawing(controlNo: string, drawing: string): Promise<string> {
        const f001kp: { status: boolean; data?: F001KP; message: string } = await this.f001kpService.findOne(controlNo);
        if (!f001kp.status) {
            throw new Error(`F001KP with control no ${controlNo} not found`);
        }
        const description = f001kp.data.F01R09?.trim();
        if (description && description.toUpperCase().replace(/\s/g, '').includes('BRAKEASSY')) {
            const side = description.match(/\(([LR])\)/i);
            if (side) {
                const explode = this.parser.explodeGL(drawing);
                drawing = drawing.replace(explode.DRAWING, explode.DRAWING + side[0].toUpperCase());
            }
        }
        return drawing;

    }

    async getDrawingByIdTag(
        serialNo: string,
    ): Promise<{ controlNo: string; drawing: string }> {
        let controlNo: string = null;
        const idtagLog: {
            status: boolean;
            data: IDTAG_EFAC_LOG[];
            message: string;
        } = await this.idtagEfacLogService.search({
            filters: [{ field: 'LOT_NO', op: 'eq', value: serialNo }],
        });

        if (!idtagLog.status) {
            throw new Error(
                `IDTAG_EFAC_LOG with serial no ${serialNo} not found`,
            );
        }

        if (idtagLog.data.length > 1) {
            throw new Error(
                `Multiple IDTAG_EFAC_LOG entries found for serial no ${serialNo}`,
            );
        }

        controlNo = idtagLog.data[0].CONTROL_NO;
        const drawing = await this.getDrawingByControlNo(controlNo);
        return { controlNo, drawing };
    }

    async getFeederInfo(controlNo: string): Promise<{
        drawing: string;
        folderPath: string;
    }> {
        const result = await this.f001kpService.findOne(controlNo);
        if (!result.status) {
            throw new Error('ไม่พบข้อมูล ID-Tag');
        }

        const drawing = this.parser.normalizeDrawing(result.data.F01R04?.trim());
        if (!drawing) {
            throw new Error('ไม่พบ Drawing ใน ID-Tag');
        }

        const yearMonth = result.data.F01R02?.trim();
        const item = result.data.F01R03?.trim();
        if (!yearMonth || yearMonth.length < 6) {
            throw new Error('ข้อมูลปี/เดือนไม่ถูกต้องใน ID-Tag');
        }

        const folderPath = [
            '',
            yearMonth.substring(0, 4),
            yearMonth.substring(4, 6),
            item,
            '',
        ].join('\\');

        return {
            drawing,
            folderPath,
        };
    }

    async getDrawingByPis(pis: string, controls: string[]): Promise<string> {
        const order: string = pis.substring(0, 7);
        const item: string = pis.substring(7, 12);
        // หา S011MP ด้วย order และ item จาก PIS
        const s011mp: { status: boolean; data: S011MP[]; message: string } =
            await this.s011mpService.search({
                filters: [
                    { field: 'S11M01', op: 'like', value: order },
                    { field: 'S11M02', op: 'eq', value: item },
                ],
            });
        if (!s011mp.status) {
            throw new Error(
                `S011MP with order ${order} and item ${item} not found`,
            );
        }
        // หา drawing ที่ตรงกับ control และไม่อยู่ใน delete list
        const matchdrawing: { drawing: string | null; order: string | null } =
            this.matchDrawingS011MP(controls, s011mp.data);
        // return drawing จาก S011MP
        if (!matchdrawing && !matchdrawing.drawing) {
            throw new Error(
                `No matching drawing found in S011MP for order ${order} and item ${item}`,
            );
        }
        return matchdrawing.drawing;
    }

    matchDrawingS011MP(
        control: string[],
        drawing: S011MP[],
    ): { drawing: string | null; order: string | null } {
        const match = drawing.find((d) => {
            return control.some((c) => {
                const drawing = d.S11M04;
                // ถ้า drawing ตรงกับ control หรือเริ่มต้นด้วย control ตามด้วย space ให้ถือว่า match
                return drawing === c || drawing.startsWith(c + ' ');
            });
        });
        return {
            drawing: match ? match.S11M04 : null,
            order: match ? match.S11M01 : null,
        };
    }
}