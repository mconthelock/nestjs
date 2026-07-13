import { Injectable } from '@nestjs/common';
import { CreateMfgDrawingCheckSheetDto } from './dto/create-mfg-drawing.dto';
import { MfgDrawingService } from './mfg-drawing.service';
import { ItemMfgService } from '../item-mfg/item-mfg.service';
import { MfgSerialService } from '../mfg-serial/mfg-serial.service';
import { MfgDrawingActionService } from '../mfg-drawing-action/mfg-drawing-action.service';
import { ITEM_MFG } from 'src/common/Entities/escs/table/ITEM_MFG.entity';
import { ITEM_MFG_LIST } from 'src/common/Entities/escs/table/ITEM_MFG_LIST.entity';
import { ITEM_MFG_DELETE } from 'src/common/Entities/escs/table/ITEM_MFG_DELETE.entity';
import { CONTROL_DRAWING_PIS } from 'src/common/Entities/escs/table/CONTROL_DRAWING_PIS.entity';
import { MFG_DRAWING } from 'src/common/Entities/escs/table/MFG_DRAWING.entity';
import { deleteFile, joinPaths } from 'src/common/utils/files.utils';
import { DrawingFileHelper } from './helpers/drawing-file.helper';
import { DrawingResolverHelper } from './helpers/drawing-resolver.helper';
import { DrawingMatcherHelper } from './helpers/drawing-matcher.helper';
import { DrawingParserHelper } from './helpers/drawing-parser.helper';

@Injectable()
export class MfgDrawingCreateChecksheetService {
    constructor(
        private readonly mfgDrawingService: MfgDrawingService,
        private readonly itemMfgService: ItemMfgService,
        private readonly mfgSerialService: MfgSerialService,
        private readonly mfgDrawingActionService: MfgDrawingActionService,
        private readonly drawingFileHelper: DrawingFileHelper,
        private readonly drawingResolverHelper: DrawingResolverHelper,
        private readonly drawingParserHelper: DrawingParserHelper,
        private readonly drawingMatcherHelper: DrawingMatcherHelper,
    ) {}

    private readonly mapType = {
        1: 'default',
        2: 'pisMulti',
        3: 'multi',
        4: 'feeder',
    };

    async create(dto: CreateMfgDrawingCheckSheetDto) {
        try {
            let message: string = 'Search Checksheet Success';

            const item = await this.itemMfgService.findOne(dto.NITEMID);
            if (!item.status) {
                throw new Error(`Item Mfg with id ${dto.NITEMID} not found`);
            }
            
            const itemData: ITEM_MFG = item.data;
            const blockName = itemData.BLOCK_MASTER ? itemData.BLOCK_MASTER.VNAME : null;
            const itemName  = itemData.VITEM_NAME;
            const itemLists: ITEM_MFG_LIST[] = itemData.ITEM_LIST;
            const deleteLists: ITEM_MFG_DELETE[] = itemData.DELETE_LIST;
            const controlLists: CONTROL_DRAWING_PIS[] = itemData.CONTROL_LIST;
            const typeName: string = this.mapType[itemData.NTYPE] || 'unknown';
            const masterPath: string = itemData.VPATH;

            if (!masterPath) {
                throw new Error(
                    `Master path not found for item ${itemName}`,
                );
            }

            let listOfCS: {
                VDRAWING: { DRAWING: string; G: string[]; L: string[][] };
                VNUMBER_FILE: string;
            } = null;

            const deleteList: string[] = deleteLists
                .filter((d) => d.NSTATUS == 1)
                .map((d) => d.VDRAWING) || [];

            const controlList: string[] = controlLists
                .filter((c) => c.NSTATUS == 1)
                .map((c) => c.VDRAWING) || [];

            const createSerialList = (type: number) =>
                dto.ASERIALNO.map((sn) => ({
                    VSERIALNO: sn,
                    NTYPE: type,
                }));

            let controlNo: string = dto.VCONTROLNO;
            let processNo: string = dto.VPROCESSNO;
            let drawing: string;
            let fileName: string;
            let newfileName: string;
            let destination: string;
            let serialList: { VSERIALNO: string; NTYPE: number }[];

            switch (typeName) {
                case 'multi':
                    destination = await this.drawingFileHelper.getDestinationPath(blockName, itemName);
                    drawing     = await this.drawingResolverHelper.getDrawingByControlNo(controlNo);
                    fileName    = itemData.VFILE;
                    newfileName = controlNo; 
                    serialList  = createSerialList(1);
                    break;
                case 'pisMulti':
                    destination = await this.drawingFileHelper.getDestinationPath(blockName, itemName);
                    drawing     = await this.drawingResolverHelper.getDrawingByPis(dto.VPIS, controlList);
                    listOfCS    = this.drawingMatcherHelper.getDataListOfCS(itemLists, drawing);
                    fileName    = listOfCS.VNUMBER_FILE;  
                    newfileName = dto.VPIS;
                    serialList  = createSerialList(2);
                    break;
                case 'feeder':
                    const info  = await this.drawingResolverHelper.getFeederInfo(controlNo); 
                    destination = await this.drawingFileHelper.getPathFeeder(info.folderPath);
                    drawing     = this.drawingParserHelper.extractDrawingNo(info.drawing);
                    processNo   = this.drawingParserHelper.extractProcessCode(processNo);
                    fileName    = await this.drawingFileHelper.findFeederFileName(drawing, processNo, masterPath);
                    const rev   = await this.drawingFileHelper.getRevisionCheckSheetFeeder(masterPath, fileName);
                    newfileName = `${drawing}-${processNo}-${rev}`;
                    break;
                default:
                    destination = await this.drawingFileHelper.getDestinationPath(blockName, itemName);
                    drawing     = await this.drawingResolverHelper.getDrawingByControlNo(controlNo);
                    const drawingCheck = await this.drawingResolverHelper.checkBreakAssyDrawing(controlNo, drawing);
                    listOfCS    = this.drawingMatcherHelper.getDataListOfCS(itemLists, drawingCheck);
                    fileName    = listOfCS.VNUMBER_FILE;
                    newfileName = controlNo;
                    serialList  = createSerialList(1);
                    break;
            }

            const insertData = await this.insertData({
                blockId: itemData.NBLOCKID,
                itemId: itemData.NID,
                drawing: drawing,
                controlNo: controlNo,
                processNo: processNo,
                pis: dto.VPIS,
                usercreate: dto.NUSERCREATE,
                typeName: typeName,
                deleteList: deleteList,
                path: masterPath,
                revise: dto.REVISE,
            });

            if (this.isEditable(insertData.NINSPECTOR_STATUS)) {
                message = 'Create Checksheet Success';
                if (['default', 'pisMulti', 'multi'].includes(typeName)) {
                    await this.insertSerial({
                        drawingId: insertData.NID,
                        serialList: serialList,
                        userCreate: dto.NUSERCREATE,
                    });
                }
            } 

            await this.drawingFileHelper.createFile(
                insertData,
                masterPath,
                destination,
                fileName,
                newfileName,
                typeName,
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

    async insertData({
        blockId,
        itemId,
        drawing,
        controlNo,
        processNo,
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
        processNo: string;
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
                pis,
                controlNo,
                processNo
            );

            // สร้างใหม่ ถ้าไม่มีข้อมูลหรือมีแต่ inspector status = 1 แต่ถ้ามีข้อมูลให้ return ข้อมูลนั้นแทน
            const data: any = {
                NBLOCKID: blockId,
                NITEMID: itemId,
                VPIS: pis,
                VDRAWING: drawing,
                VCONTROLNO: controlNo,
                VPROCESSNO: processNo,
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
                    this.drawingMatcherHelper.checkDeleteDrawing(deleteList, drawing) &&
                    [1, 3].includes(isDataExist.data.NSTATUS) &&
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
        pis?: string,
        controlNo?: string,
        processNo?: string,
    ): Promise<{ status: boolean; data: MFG_DRAWING | null; message: string }> {
        try {
            const condition = [
                { field: 'NBLOCKID', op: 'eq', value: blockId },
                { field: 'NITEMID', op: 'eq', value: itemId },
                { field: 'VDRAWING', op: 'eq', value: drawing },
            ];

            if(pis){
                condition.push({ field: 'VPIS', op: 'eq', value: pis });
            }

            if(controlNo){
                condition.push({ field: 'VCONTROLNO', op: 'eq', value: controlNo });
            }

            if(processNo){
                condition.push({ field: 'VPROCESSNO', op: 'eq', value: processNo });
            }

            const drawingData = await this.mfgDrawingService.search({
                filters: condition,
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
