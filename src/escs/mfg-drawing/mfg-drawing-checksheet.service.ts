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
import { basename } from 'path';
import { MfgSerialService } from '../mfg-serial/mfg-serial.service';

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
        private readonly idtagEfacLogService: IdtagEfacLogService,
        private readonly f110kpService: F110kpService,
        private readonly s011mpService: S011mpService,
        private readonly fileService: FileService,
        private readonly mfgSerialService: MfgSerialService,
    ) {}

    private readonly mapType = {
        1: 'default',
        2: 'pisMulti',
        3: 'multi',
    };

    async create(dto: CreateMfgDrawingCheckSheetDto) {
        try {
            // หา item mfg ด้วย NITEMID
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
            let itemList: ITEM_MFG_LIST = null;
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
            let fileName: string;
            let newfileName: string;
            switch (typeName) {
                case 'multi':
                    newfileName = dto.ASERIALNO[0];
                    fileName = itemData.VFILE;
                    drawing = await this.getDrawingByIdTag(dto.ASERIALNO[0]);
                    break;
                case 'pisMulti':
                    newfileName = dto.VPIS;
                    drawing = await this.getDrawingByPis(dto.VPIS, controlList);
                    itemList = this.getDrawingList(itemLists, drawing);
                    fileName = itemList.VNUMBER_FILE;
                    break;
                default:
                    newfileName = dto.ASERIALNO[0];
                    drawing = await this.getDrawingByIdTag(dto.ASERIALNO[0]);
                    itemList = this.getDrawingList(itemLists, drawing);
                    fileName = itemList.VNUMBER_FILE;
                    break;
            }

            const insertData = await this.insertData({
                blockId: itemData.NBLOCKID,
                itemId: itemData.NID,
                drawing: drawing,
                pis: dto.VPIS,
                usercreate: dto.NUSERCREATE,
                typeName: typeName,
                deleteList: deleteList,
                path: masterPath,
            });

            if(this.isEditable(insertData.NINSPECTOR_STATUS)){
                const insertSerial = await this.insertSerial({
                    drawingId: insertData.NID,
                    serialNo: dto.ASERIALNO,
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
                message: 'Create Checksheet Success',
                status: true,
            };
        } catch (error) {
            throw new Error('Create Checksheet Failed: ' + error.message);
        }
    }

    async getDrawingByIdTag(serialNo: string): Promise<string> {
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
        controlNo = idtagLog.data[0].CONTROL_NO;
        // หา F110KP ด้วย control no
        const f110kp: { status: boolean; data?: F110KP; message: string } =
            await this.f110kpService.findOne(controlNo);
        if (!f110kp.status) {
            throw new Error(`F110KP with control no ${controlNo} not found`);
        }
        // return drawing จาก F110KP
        return f110kp.data.F11K27;
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
            this.matchDrawing(controls, s011mp.data);
        // return drawing จาก S011MP
        if (!matchdrawing && !matchdrawing.drawing) {
            throw new Error(
                `No matching drawing found in S011MP for order ${order} and item ${item}`,
            );
        }
        return matchdrawing.drawing;
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

    getDrawingList(list: ITEM_MFG_LIST[], drawing: string): ITEM_MFG_LIST {
        const matched = list.find(
            (l) =>
                l.NSTATUS == 1 &&
                (l.VDRAWING === drawing || drawing.startsWith(l.VDRAWING + ' ')),
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
            (e) => (drawing === e || drawing.startsWith(e + ' ')),
        );
    }

    async insertData({
        blockId,
        itemId,
        drawing,
        pis,
        usercreate,
        typeName,
        deleteList,
        path,
    }: {
        blockId: number;
        itemId: number;
        drawing: string;
        pis: string;
        usercreate: number;
        typeName: string;
        deleteList: string[];
        path: string;
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
                // ถ้าไม่ใช่ multi และ drawing อยู่ใน delete list ให้ตั้ง status เป็น 3
                if (
                    typeName != 'multi' &&
                    this.checkDeleteDrawing(deleteList, drawing)
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
        serialNo,
        userCreate,
    }: {
        drawingId: number;
        serialNo: string[];
        userCreate: number;
    }) {
        await this.mfgSerialService.removeByDrawingId(drawingId);
        const insertBatch = serialNo.map((sn) => ({
            NDRAWINGID: drawingId,
            VSERIALNO: sn,
            NUSERCREATE: userCreate,
        }));
        const res = await this.mfgSerialService.create(insertBatch);
        if (!res) {
            throw new Error('Insert MFG_SERIAL Failed');
        }
        return res;
    }
}
