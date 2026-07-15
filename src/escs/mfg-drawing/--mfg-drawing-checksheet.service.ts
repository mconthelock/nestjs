import { Injectable } from '@nestjs/common';
import { CreateMfgDrawingCheckSheetDto } from './dto/create-mfg-drawing.dto';
import { ItemMfgService } from '../item-mfg/item-mfg.service';
import { IdtagEfacLogService } from 'src/workload/idtag-efac-log/idtag-efac-log.service';
import { S011mpService } from 'src/datacenter/s011mp/s011mp.service';
import { ITEM_MFG_LIST } from 'src/common/Entities/escs/table/ITEM_MFG_LIST.entity';
import { ITEM_MFG_DELETE } from 'src/common/Entities/escs/table/ITEM_MFG_DELETE.entity';
import { ITEM_MFG } from 'src/common/Entities/escs/table/ITEM_MFG.entity';
import { F110kpService } from 'src/datacenter/f110kp/f110kp.service';
import { CONTROL_DRAWING_PIS } from 'src/common/Entities/escs/table/CONTROL_DRAWING_PIS.entity';
import { S011MP } from 'src/common/Entities/datacenter/table/S011MP.entity';
import { MfgDrawingService } from './mfg-drawing.service';
import { MFG_DRAWING } from 'src/common/Entities/escs/table/MFG_DRAWING.entity';
import { copyFile, deleteFile, joinPaths } from 'src/common/utils/files.utils';
import { IDTAG_EFAC_LOG } from 'src/common/Entities/workload/table/IDTAG_EFAC_LOG.entity';
import { F110KP } from 'src/common/Entities/datacenter/table/F110KP.entity';
import { FileService } from 'src/common/services/file/file.service';
import { ListMode } from 'src/common/services/file/dto/file.dto';
import { basename } from 'path';
import { MfgSerialService } from '../mfg-serial/mfg-serial.service';
import { MfgDrawingActionService } from '../mfg-drawing-action/mfg-drawing-action.service';
import { F001kpService } from 'src/datacenter/f001kp/f001kp.service';
import { F001KP } from 'src/common/Entities/datacenter/table/F001KP.entity';
import { GeneralPartListService } from 'src/general-part-list/general-part-list.service';

@Injectable()
export class MfgDrawingCreateChecksheetService {
    constructor(
        private readonly mfgDrawingService: MfgDrawingService,
        private readonly itemMfgService: ItemMfgService,
        private readonly idtagEfacLogService: IdtagEfacLogService,
        private readonly f110kpService: F110kpService,
        private readonly f001kpService: F001kpService,
        private readonly s011mpService: S011mpService,
        private readonly fileService: FileService,
        private readonly mfgSerialService: MfgSerialService,
        private readonly mfgDrawingActionService: MfgDrawingActionService,
        private readonly generalPartListService: GeneralPartListService,
    ) {}

    private readonly mapType = {
        1: 'default',
        2: 'pisMulti',
        3: 'multi',
    };

    async create(dto: CreateMfgDrawingCheckSheetDto) {
        try {
            // หา item mfg ด้วย NITEMID
            let message: string = 'Search Checksheet Success';
            const item = await this.itemMfgService.findOne(dto.NITEMID);
            if (!item.status) {
                throw new Error(`Item Mfg with id ${dto.NITEMID} not found`);
            }
            const itemData: ITEM_MFG = item.data;
            const blockName = itemData.BLOCK_MASTER
                ? itemData.BLOCK_MASTER.VNAME
                : null;
            const itemName = itemData.VITEM_NAME;
            const itemLists: ITEM_MFG_LIST[] = itemData.ITEM_LIST;
            const deleteLists: ITEM_MFG_DELETE[] = itemData.DELETE_LIST;
            const controlLists: CONTROL_DRAWING_PIS[] = itemData.CONTROL_LIST;
            const typeName: string = this.mapType[itemData.NTYPE] || 'unknown';
            const masterPath: string = itemData.VPATH;
            // let itemList: ITEM_MFG_LIST = null;
            let listOfCS: {
                VDRAWING: { DRAWING: string; G: string[]; L: string[][] };
                VNUMBER_FILE: string;
            } = null;
            const deleteList: string[] =
                deleteLists
                    .filter((d) => d.NSTATUS == 1)
                    .map((d) => d.VDRAWING) || [];
            const controlList: string[] =
                controlLists
                    .filter((c) => c.NSTATUS == 1)
                    .map((c) => c.VDRAWING) || [];
            if (!masterPath) {
                throw new Error(
                    `Master path not found for item ${itemData.VITEM_NAME}`,
                );
            }
            let drawing: string;
            let controlNo: string = dto.VCONTROLNO;
            let fileName: string;
            let newfileName: string;
            let serialList: { VSERIALNO: string; NTYPE: number }[];
            let dataByidTag: { controlNo: string; drawing: string };
            switch (typeName) {
                case 'multi':
                    newfileName = controlNo //dto.ASERIALNO[0];
                    fileName = itemData.VFILE;
                    // dataByidTag = await this.getDrawingByIdTag(
                    //     dto.ASERIALNO[0],
                    // );
                    // drawing = dataByidTag.drawing;
                    drawing = await this.getDrawingByControlNo(controlNo);
                    serialList = dto.ASERIALNO.map((sn, index) => ({
                        VSERIALNO: sn,
                        NTYPE: 1, // กำหนด type เป็น 1 สำหรับ serial no ทั้งหมดในกรณี multi
                    }));
                    break;
                case 'pisMulti':
                    newfileName = dto.VPIS;
                    drawing = await this.getDrawingByPis(dto.VPIS, controlList);
                    listOfCS = this.getDataListOfCS(itemLists, drawing);
                    fileName = listOfCS.VNUMBER_FILE;
                    serialList = dto.ASERIALNO.map((sn, index) => ({
                        VSERIALNO: sn,
                        NTYPE: 2, // กำหนด type เป็น 2 สำหรับ serial no ทั้งหมดในกรณี pisMulti
                    }));
                    break;
                default:
                    newfileName = controlNo //dto.ASERIALNO[0];
                    // dataByidTag = await this.getDrawingByIdTag(
                    //     dto.ASERIALNO[0],
                    // );
                    // drawing = dataByidTag.drawing;
                    drawing = await this.getDrawingByControlNo(controlNo);
                    listOfCS = this.getDataListOfCS(itemLists, drawing);
                    fileName = listOfCS.VNUMBER_FILE;
                    serialList = dto.ASERIALNO.map((sn, index) => ({
                        VSERIALNO: sn,
                        NTYPE: 1, // กำหนด type เป็น 1 สำหรับ serial no ทั้งหมดในกรณี default
                    }));
                    break;
            }

            const insertData = await this.insertData({
                blockId: itemData.NBLOCKID,
                itemId: itemData.NID,
                drawing: drawing,
                controlNo: controlNo,
                pis: dto.VPIS,
                usercreate: dto.NUSERCREATE,
                typeName: typeName,
                deleteList: deleteList,
                path: masterPath,
                revise: dto.REVISE,
            });

            if (this.isEditable(insertData.NINSPECTOR_STATUS)) {
                message = 'Create Checksheet Success';
                const insertSerial = await this.insertSerial({
                    drawingId: insertData.NID,
                    serialList: serialList,
                    userCreate: dto.NUSERCREATE,
                });
            }

            const destination = await joinPaths(
                process.env.CHECKSHEET_MFG_FILE_PATH,
                'temp',
                'block_' + blockName,
                'station_' + itemName,
            );
            await this.createFile(
                insertData,
                masterPath,
                destination,
                fileName,
                newfileName,
            );
            const res = await this.mfgDrawingService.findOne(insertData.NID);
            return {
                data: res.data,
                message: dto.REVISE ? 'Revise Checksheet Success' : message,
                status: true,
            };
        } catch (error) {
            throw new Error('Create Checksheet Failed: ' + error.message);
        }
    }

    async getDrawingByControlNo(controlNo: string): Promise<string> {
        const f001kp: { status: boolean; data?: F001KP; message: string } =
            await this.f001kpService.findOne(controlNo);
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
        const order = data.F01R07?.trim();
        const item = data.F01R03?.trim();
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

    async getDrawingByIdTag(
        serialNo: string,
    ): Promise<{ controlNo: string; drawing: string }> {
        let controlNo: string = null;
        // หา control no จาก serial no
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
        // ------------อันแรก------------
        // หา F110KP ด้วย control no
        // const f110kp: { status: boolean; data?: F110KP; message: string } =
        //     await this.f110kpService.findOne(controlNo);
        // if (!f110kp.status) {
        //     throw new Error(`F110KP with control no ${controlNo} not found`);
        // }
        // const data = f110kp.data;
        // let drawing: string = null;
        // if (!data.F11K27 || data.F11K27.trim() === '') {
        //     if (!data.F11K10 || data.F11K10.trim() === '') {
        //         drawing = data.F11K16;
        //     } else {
        //         drawing = data.F11K10;
        //     }
        // } else {
        //     drawing = data.F11K27;
        // }

        const f001kp: { status: boolean; data?: F001KP; message: string } =
            await this.f001kpService.findOne(controlNo);
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
        const order = data.F01R07?.trim();
        const item = data.F01R03?.trim();
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

        drawing = match.DRAWING;

        return { controlNo, drawing };
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

    // getDrawingList(list: ITEM_MFG_LIST[], drawing: string): ITEM_MFG_LIST {
    //     const matched = list.find(
    //         (l) =>
    //             l.NSTATUS == 1 &&
    //             (l.VDRAWING === drawing ||
    //                 drawing.startsWith(l.VDRAWING + ' ')),
    //     );
    //     if (!matched) {
    //         throw new Error(
    //             `No matching drawing found in Master for drawing ${drawing}`,
    //         );
    //     }
    //     return matched;
    // }

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
            const dwg = this.extractDrawing(drawing);
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
        const gl = this.splitGPL(split[1]);
        dwg.push(...gl);
        return dwg;
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
                VDRAWING: this.explodeGL(l.VDRAWING),
                VNUMBER_FILE: l.VNUMBER_FILE,
            }));
        return mapList;
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
            VDRAWING: this.explodeGL(d),
        }));

        const dwg = this.extractDrawing(drawing);

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
    // checkDeleteDrawing(deleteDwg: string[], drawing: string): boolean {
    //     return deleteDwg.some(
    //         (e) => drawing === e || drawing.startsWith(e + ' '),
    //     );
    // }

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
            let GL = val.split('~');

            let min = GL[0].replace(/[GL]{1}/g, '');
            let max = GL[1].replace(/[GL]{1}/g, '');

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

    async insertData({
        blockId,
        itemId,
        drawing,
        controlNo,
        pis,
        usercreate,
        typeName,
        deleteList,
        path,
        revise,
    }: {
        blockId: number;
        itemId: number;
        drawing: string;
        controlNo: string;
        pis: string;
        usercreate: number;
        typeName: string;
        deleteList: string[];
        path: string;
        revise?: boolean;
    }): Promise<MFG_DRAWING[] | any | null> {
        try {
            // ตรวจสอบว่ามีข้อมูลที่ตรงกับ blockId, itemId, drawing และ inspector status = 1 อยู่แล้วหรือไม่
            const isDataExist = await this.checkDataExist(
                blockId,
                itemId,
                drawing,
            );
            // สร้างใหม่ ถ้าไม่มีข้อมูลหรือมีแต่ inspector status = 1 แต่ถ้ามีข้อมูลให้ return ข้อมูลนั้นแทน
            const data: any = {
                NBLOCKID: blockId,
                NITEMID: itemId,
                VPIS: pis,
                VDRAWING: drawing,
                VCONTROLNO: controlNo,
                NINSPECTOR_STATUS: 1,
                NFORELEAD_STATUS: 4,
                VFILE_NAME: null,
                NSTATUS: 1,
                NUSERCREATE: usercreate,
            };
            if (isDataExist.status) {
                data.NID = isDataExist.data.NID;
                data.NUSERUPDATE = usercreate;
                data.DDATEUPDATE = new Date();
                // ถ้า revise เป็น true ให้ update drawing และ delete serial

                if (revise) {
                    const update = await this.mfgSerialService.update(
                        { NDRAWINGID: data.NID },
                        { NSTATUS: 3 },
                    );
                    await this.mfgDrawingActionService.update(data.NID, {
                        NSTATUS: 3,
                    });
                }

                // ถ้าไม่ใช่ multi และ drawing อยู่ใน delete list ให้ตั้ง status เป็น 3
                if (
                    typeName != 'multi' &&
                    this.checkDeleteDrawing(deleteList, drawing) &&
                    [1,3].includes(isDataExist.data.NSTATUS) &&
                    isDataExist.data.NINSPECTOR_STATUS === 1
                ) {
                    data.NSTATUS = 3;
                    if (isDataExist.data.VFILE_NAME) {
                        const filePath = await joinPaths(
                            path,
                            isDataExist.data.VFILE_NAME,
                        );
                        await deleteFile(filePath);
                    }
                }
            }
            if (
                !isDataExist.status ||
                this.isEditable(isDataExist.data?.NINSPECTOR_STATUS) ||
                revise
                // isDataExist.data?.NINSPECTOR_STATUS == 1
            ) {
                const insert = await this.mfgDrawingService.create(data);
                if (!insert.status) {
                    throw new Error(
                        `Insert MFG_DRAWING Failed: ${insert.message}`,
                    );
                }
                return insert.data;
            } else {
                return isDataExist.data;
            }
        } catch (error) {
            throw new Error('Insert Data Failed: ' + error.message);
        }
    }

    isEditable(status: number): boolean {
        return status === 1;
    }

    /**
     * Check ว่ามีข้อมูลหรือไม่
     */
    async checkDataExist(
        blockId: number,
        itemId: number,
        drawing: string,
    ): Promise<{ status: boolean; data: MFG_DRAWING | null; message: string }> {
        try {
            const drawingData = await this.mfgDrawingService.search({
                filters: [
                    { field: 'NBLOCKID', op: 'eq', value: blockId },
                    { field: 'NITEMID', op: 'eq', value: itemId },
                    { field: 'VDRAWING', op: 'eq', value: drawing },
                ],
            });
            return {
                status: drawingData.data.length > 0,
                data: drawingData.data?.[0] || null,
                message:
                    drawingData.data.length > 0
                        ? 'Data already exists'
                        : 'Data does not exist',
            };
        } catch (error) {
            throw new Error('Check Data Exist Failed: ' + error.message);
        }
    }

    async createFile(
        data: MFG_DRAWING,
        path: string,
        destination: string,
        fileName: string,
        newName: string,
    ): Promise<void> {
        try {
            if (data && data.NINSPECTOR_STATUS == 1 && data.NSTATUS == 1) {
                const file = await this.getExcelFile(fileName, path);
                const filePath = await copyFile(
                    file.path,
                    destination,
                    newName + '.' + file.extension,
                );
                await this.mfgDrawingService.update(data.NID, {
                    VFULL_PATH: filePath,
                    VFILE_NAME: basename(filePath),
                    NSTATUS: 4,
                    DDATEUPDATE: new Date(),
                    NUSERUPDATE: data.NUSERCREATE,
                });
            }
        } catch (error) {
            throw new Error('Create File Failed: ' + error.message);
        }
    }

    async getExcelFile(fileName: string, path: string) {
        const files = await this.fileService.listDir({
            baseDir: path,
            allow: ['xls', 'xlsx'],
            mode: ListMode.FILE,
        });
        const drawingFile = files.find((f) => {
            const nameWithoutExt = f.name.replace(/\.[^/.]+$/, '');
            return (
                f.name === fileName ||
                nameWithoutExt === fileName ||
                nameWithoutExt.startsWith(fileName + ' ')
            );
        });

        if (!drawingFile) {
            throw new Error(
                `File with name ${fileName} not found in path ${path}`,
            );
        }
        return drawingFile;
    }

    async insertSerial({
        drawingId,
        serialList,
        userCreate,
    }: {
        drawingId: number;
        serialList: { VSERIALNO: string; NTYPE: number }[];
        userCreate: number;
    }) {
        await this.mfgSerialService.removeByCondition({
            NDRAWINGID: drawingId,
        });
        const insertBatch = serialList.map((sn) => ({
            NDRAWINGID: drawingId,
            VSERIALNO: sn.VSERIALNO,
            NTYPE: sn.NTYPE,
            NUSERCREATE: userCreate,
        }));
        const res = await this.mfgSerialService.create(insertBatch);
        if (!res) {
            throw new Error('Insert MFG_SERIAL Failed');
        }
        return res;
    }
}
