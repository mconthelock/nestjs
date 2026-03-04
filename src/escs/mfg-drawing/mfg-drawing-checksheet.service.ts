import { Injectable } from '@nestjs/common';
import { CreateMfgDrawingCheckSheetDto } from './dto/create-mfg-drawing.dto';
import { UpdateMfgDrawingDto } from './dto/update-mfg-drawing.dto';
import { ItemMfgListService } from '../item-mfg-list/item-mfg-list.service';
import { ItemMfgService } from '../item-mfg/item-mfg.service';
import { ItemMfgDeleteService } from '../item-mfg-delete/item-mfg-delete.service';
import { IdtagEfacLogService } from 'src/workload/idtag-efac-log/idtag-efac-log.service';
import { S011mpService } from 'src/datacenter/s011mp/s011mp.service';
import { ITEM_MFG_LIST } from 'src/common/Entities/escs/table/ITEM_MFG_LIST.entity';
import { ITEM_MFG_DELETE } from 'src/common/Entities/escs/table/ITEM_MFG_DELETE.entity';
import { ITEM_MFG } from 'src/common/Entities/escs/table/ITEM_MFG.entity';
import { F110kpService } from 'src/datacenter/f110kp/f110kp.service';
import { CONTROL_DRAWING_PIS } from 'src/common/Entities/escs/table/CONTROL_DRAWING_PIS.entity';
import { ControlDrawingPisService } from '../control-drawing-pis/control-drawing-pis.service';
import { S011MP } from 'src/common/Entities/datacenter/table/S011MP.entity';
import { MfgDrawingService } from './mfg-drawing.service';
import { MFG_DRAWING } from 'src/common/Entities/escs/table/MFG_DRAWING.entity';
import { copyFile, deleteFile, joinPaths } from 'src/common/utils/files.utils';
import { IDTAG_EFAC_LOG } from 'src/common/Entities/workload/table/IDTAG_EFAC_LOG.entity';
import { F110KP } from 'src/common/Entities/datacenter/table/F110KP.entity';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { FileService } from 'src/common/services/file/file.service';
import { ListMode } from 'src/common/services/file/dto/file.dto';

interface State {
    blockId: number;
    itemId: number;
    usercreate: number;
    serialNo: string[];
    pis: string;
    type: number;
    typeName: string;
    itemMfg: ITEM_MFG;
    list: ITEM_MFG_LIST;
    delete: string[];
    control: string[];
    drawing: string;
    item: string;
    order: string;
    controlNo: string;
    data: any;
    path: string;
}

@Injectable()
export class MfgDrawingCreateChecksheetService {
    constructor(
        private readonly mfgDrawingService: MfgDrawingService,
        private readonly itemMfgService: ItemMfgService,
        private readonly itemMfgListService: ItemMfgListService,
        private readonly itemMfgDeleteService: ItemMfgDeleteService,
        private readonly controlDrawingPisService: ControlDrawingPisService,
        private readonly idtagEfacLogService: IdtagEfacLogService,
        private readonly f110kpService: F110kpService,
        private readonly s011mpService: S011mpService,
        private readonly fileService: FileService,
    ) {}

    private readonly mapType = {
        1: 'default',
        2: 'pisMulti',
        3: 'multi',
    };

    async create(dto: CreateMfgDrawingCheckSheetDto) {
        try {
            const state: State = {
                blockId: dto.NBLOCKID,
                itemId: dto.NITEMID,
                usercreate: dto.NUSERCREATE,
                serialNo: dto.ASERIALNO ?? [],
                pis: dto.VPIS ?? null,
                type: null,
                typeName: null,
                itemMfg: null,
                list: null,
                delete: [],
                control: [],
                drawing: null,
                item: null,
                order: null,
                controlNo: null,
                data: null,
                path: null,
            };
            // หา item mfg ด้วย NITEMID
            const item = await this.itemMfgService.findOne(dto.NITEMID);
            if (!item.status) {
                throw new Error(`Item Mfg with id ${dto.NITEMID} not found`);
            }
            // กำหนด type และ typeName ตาม NTYPE ของ item mfg
            state.itemMfg = item.data;
            state.type = item.data.NTYPE;
            state.typeName = this.mapType[item.data.NTYPE] || 'unknown';
            state.path = item.data.VPATH;

            let dataList: ITEM_MFG_LIST[];
            switch (state.typeName) {
                case 'multi':
                    await this.getDrawingByIdTag(state);
                    break;
                case 'pisMulti':
                    dataList = await this.getList(state);
                    state.list = this.getListDrawing(
                        dataList,
                        await this.getDrawingByPis(state),
                    );
                    break;
                default:
                    dataList = await this.getList(state);
                    state.list = this.getListDrawing(
                        dataList,
                        await this.getDrawingByIdTag(state),
                    );
                    break;
            }

            const insert = await this.insertData(state);
            state.data = insert;

            await this.createFile(state);

            return state;
        } catch (error) {
            throw new Error('Create Checksheet Failed: ' + error.message);
        }
    }

    async getList(state: State): Promise<ITEM_MFG_LIST[]> {
        const itemId: number = state.itemId;
        let itemLists: ITEM_MFG_LIST[] = [];
        const condition: FiltersDto = {
            filters: [
                { field: 'NITEMID', op: 'eq', value: itemId },
                { field: 'NSTATUS', op: 'eq', value: 1 },
            ],
        };
        const listResult: {
            status: boolean;
            data: ITEM_MFG_LIST[];
            message: string;
        } = await this.itemMfgListService.search(condition);
        if (!listResult.status) {
            throw new Error(`Item Mfg List with item id ${itemId} not found`);
        }
        itemLists = listResult.data;

        const deleteResult: {
            status: boolean;
            data: ITEM_MFG_DELETE[];
            message: string;
        } = await this.itemMfgDeleteService.search(condition);
        if (deleteResult.status) {
            state.delete = deleteResult.data?.map((d) => d.VDRAWING) || [];
        }

        const controlResult: {
            status: boolean;
            data: CONTROL_DRAWING_PIS[];
            message: string;
        } = await this.controlDrawingPisService.search(condition);
        if (controlResult.status) {
            state.control = controlResult.data?.map((c) => c.VDRAWING) || [];
        }

        return itemLists;
    }

    async getDrawingByIdTag(state: State): Promise<string> {
        const serialNo: string[] = state.serialNo;
        let controlNo: string = null;
        // หา control no จาก serial no
        const idtagLog: {
            status: boolean;
            data: IDTAG_EFAC_LOG[];
            message: string;
        } = await this.idtagEfacLogService.search({
            filters: [{ field: 'LOT_NO', op: 'eq', value: serialNo[0] }],
        });
        if (!idtagLog.status) {
            throw new Error(
                `IDTAG_EFAC_LOG with serial no ${serialNo[0]} not found`,
            );
        }
        controlNo = idtagLog.data[0].CONTROL_NO;
        state.controlNo = controlNo;
        // หา F110KP ด้วย control no
        const f110kp: { status: boolean; data?: F110KP; message: string } =
            await this.f110kpService.findOne(controlNo);
        if (!f110kp.status) {
            throw new Error(`F110KP with control no ${controlNo} not found`);
        }
        // return drawing จาก F110KP
        state.drawing = f110kp.data.F11K27;
        return state.drawing;
    }

    async getDrawingByPis(state: State): Promise<string> {
        const pis: string = state.pis;
        const control: string[] = state.control;
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
            this.matchDrawing(control, s011mp.data);
        if (!matchdrawing) {
            throw new Error(
                `No matching drawing found in S011MP for order ${order} and item ${item}`,
            );
        }
        // return drawing จาก S011MP
        state.drawing = matchdrawing.drawing;
        state.order = matchdrawing.order;
        state.item = item;
        return state.drawing;
    }

    matchDrawing(
        control: string[],
        drawing: S011MP[],
    ): { drawing: string | null; order: string | null } {
        const match = drawing.find((d) => {
            return control.some((c) => {
                const drawing = d.S11M04;
                // ถ้า drawing อยู่ใน delete list ให้ข้าม
                // if (
                //     state.delete.some(
                //         (e) => drawing === e || drawing.startsWith(e + ' '),
                //     )
                // ) {
                //     return false;
                // }
                // console.log('Drawing', drawing);
                // console.log('Control', c);
                // console.log('Match', drawing === c || drawing.startsWith(c + ' '));
                // ถ้า drawing ตรงกับ control หรือเริ่มต้นด้วย control ตามด้วย space ให้ถือว่า match
                return drawing === c || drawing.startsWith(c + ' ');
            });
        });
        return {
            drawing: match ? match.S11M04 : null,
            order: match ? match.S11M01 : null,
        };
    }

    getListDrawing(list: ITEM_MFG_LIST[], drawing: string): ITEM_MFG_LIST {
        const matched = list.find(
            (l) =>
                l.VDRAWING === drawing || drawing.startsWith(l.VDRAWING + ' '),
        );
        if (!matched) {
            throw new Error(
                `No matching drawing found in ITEM_MFG_LIST for drawing ${drawing}`,
            );
        }
        return matched;
    }

    checkDeleteDrawing(deleteDwg: string[], drawing: string): boolean {
        return deleteDwg.some(
            (e) => drawing === e || drawing.startsWith(e + ' '),
        );
    }

    async insertData(state: State): Promise<MFG_DRAWING[] | any | null> {
        try {
            // ตรวจสอบว่ามีข้อมูลที่ตรงกับ blockId, itemId, drawing และ inspector status = 1 อยู่แล้วหรือไม่
            const isDataExist = await this.checkDataExist(
                state.blockId,
                state.itemId,
                state.drawing,
            );
            // สร้างใหม่ ถ้าไม่มีข้อมูลหรือมีแต่ inspector status = 1 แต่ถ้ามีข้อมูลให้ return ข้อมูลนั้นแทน
            const data: any = {
                NBLOCKID: state.blockId,
                NITEMID: state.itemId,
                VPIS: state.pis,
                VDRAWING: state.drawing,
                NINSPECTOR_STATUS: 1,
                NFORELEAD_STATUS: 4,
                VFILE_NAME: null,
                NSTATUS: 1,
                NUSERCREATE: state.usercreate,
            };
            if (isDataExist.status) {
                data.NID = isDataExist.data.NID;
                data.NUSERUPDATE = state.usercreate;
                data.DDATEUPDATE = new Date();
                // ถ้าไม่ใช่ multi และ drawing อยู่ใน delete list ให้ตั้ง status เป็น 3
                if (
                    state.typeName != 'multi' &&
                    this.checkDeleteDrawing(state.delete, state.drawing)
                ) {
                    data.NSTATUS = 3;
                    if (isDataExist.data.VFILE_NAME) {
                        const filePath = await joinPaths(
                            state.path,
                            isDataExist.data.VFILE_NAME,
                        );
                        await deleteFile(filePath);
                    }
                }
            }
            if (
                !isDataExist.status ||
                this.isEditable(isDataExist.data?.NINSPECTOR_STATUS)
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

    async createFile(state: State): Promise<void> {
        try {
            if (
                state.data &&
                state.data.NINSPECTOR_STATUS == 1 &&
                state.data.NSTATUS == 1
            ) {
                const file = await this.getExcelFile(state.list, state.path);
                console.log('file', file);
                // ชื่อ block/ชื่อ station/filename
                const destination = await joinPaths(
                    process.env.CHECKSHEET_MFG_FILE_PATH,
                    'temp',
                    'block_' + state.blockId,
                    'station_' + state.itemMfg.VITEM_NAME,
                    
                ); 
                await copyFile(file.path, destination, state.serialNo[0]+'.'+ file.extension,);

            }
        } catch (error) {
            throw new Error('Create File Failed: ' + error.message);
        }
    }

    async getExcelFile(list: ITEM_MFG_LIST, path: string) {
        const files= await this.fileService.listDir({
            baseDir: path,
            allow: ['xls', 'xlsx'],
            mode: ListMode.FILE,
        });
        
        const drawingFile = files.find((f) => {
            const nameWithoutExt = f.name.replace(/\.[^/.]+$/, '');
            return (
                nameWithoutExt === list.VNUMBER_FILE ||
                nameWithoutExt.startsWith(list.VNUMBER_FILE + ' ')
            );
        });

        if (!drawingFile) {
            throw new Error(
                `File with name ${list.VNUMBER_FILE} not found in path ${path}`,
            );
        }
        return drawingFile;
    }
}
