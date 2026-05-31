import { Injectable } from '@nestjs/common';
import { CreateReturnApvListDto } from './dto/create-return-apv-list.dto';
import {
    ActionReturnApvListDto,
    UpdateReturnApvListDto,
} from './dto/update-return-apv-list.dto';
import { ReturnApvListRepository } from './return-apv-list.repository';
import { OrdersDrawingService } from '../orders-drawing/orders-drawing.service';
import { MailService } from 'src/common/services/mail/mail.service';
import {
    joinPaths,
    moveFileFormPath,
    moveFileFromMulter,
} from 'src/common/utils/files.utils';
import { GetOrderService } from '../get-order/get-order.service';
import { UsersSectionService } from '../user_section/user_section.service';
import { SequenceOrgService } from 'src/webform/center/sequence-org/sequence-org.service';

@Injectable()
export class ReturnApvListService {
    constructor(
        private readonly repo: ReturnApvListRepository,
        private readonly orderDrawingService: OrdersDrawingService,
        private readonly mailService: MailService,
        private readonly getOrderService: GetOrderService,
        private readonly userSectionService: UsersSectionService,
        private readonly sequenceOrgService: SequenceOrgService,
    ) {}

    async return(dto: CreateReturnApvListDto) {
        try {
            const insert = await this.repo.upsert(dto);
            await this.orderDrawingService.update({
                ORD_PRODUCTION: dto.VPROD,
                ORD_ITEM: dto.VITEM,
                ORD_NO: dto.VORD_NO,
                ORDDW_ID: dto.NDRAWINGID,
                ORDDW_FORELEAD_STATUS: 8,
            });
            const list = await this.repo.findById(insert.NID);
            const section = await this.userSectionService.getUserSecByID(
                dto.NSECID,
            );
            const sem = await this.sequenceOrgService.getByPosition({
                SPOSCODE: '30',
                VORGNO: section.SSECCODE,
            });
            if (!sem.status) {
                throw new Error(
                    `Manager with position code 30 and org code ${section.SSECCODE} not found`,
                );
            }
            await this.mailService.sendMail({
                to:
                    process.env.NODE_ENV != 'production'
                        ? process.env.MAIL_ADMIN
                        : sem.data.EMPINFO.SRECMAIL,
                subject: 'Auto check sheet return approve',
                template: 'escs-return-approve',
                context: {
                    toName: sem.data.EMPINFO.SNAME,
                    list: [
                        {
                            PROD: list.VPROD,
                            ORD_NO: list.VORD_NO,
                            ITEM: list.VITEM,
                            PROJECT: list.ordersDrawing.orders.ORD_PROJECT,
                            PATHNAME: list.ordersDrawing.ORDDW_PART,
                            DRAWING: list.ordersDrawing.ORDDW_DRAWING,
                            WAITING: true,
                        },
                    ],
                },
                bcc: process.env.MAIL_ADMIN,
            });
            return {
                status: true,
                message: 'Return Successfully',
            };
        } catch (error) {
            throw new Error(`Failed to return: ${error.message}`);
        }
    }

    async actions(dto: ActionReturnApvListDto) {
        let filesList: {
            masterPath: string;
            tempPath: string;
            fileName: string;
        }[] = [];
        try {
            let targetPath: string[] = [];
            const list = dto.LIST;
            const listsByEmp: Record<
                string,
                { EMAIL: string; USER_CREATE: string; rows: any[] }
            > = {};
            for (const l of list) {
                const status = l.NSTATUS === 1 ? 5 : l.NSTATUS === 2 ? 7 : 8;
                await this.repo.upsert(l);
                const data = await this.repo.findById(l.NID);
                const userData = data.userCreate.user;

                const updateDwg = await this.orderDrawingService.update({
                    ORD_PRODUCTION: data.VPROD,
                    ORD_ITEM: data.VITEM,
                    ORD_NO: data.VORD_NO,
                    ORDDW_ID: data.NDRAWINGID,
                    ORDDW_FORELEAD_STATUS: status,
                });
                if (!updateDwg.status) {
                    throw new Error(
                        `Failed to update ORDERS_DRAWING with NID: ${l.NID}`,
                    );
                }

                //prettier-ignore
                if (l.NSTATUS === 1) {
                    const orderRes = await this.getOrderService.findOne(
                        data.VPROD,
                        data.VORD_NO,
                        data.VITEM,
                        data.NDRAWINGID,
                    );
                    if(!orderRes.status) {
                        throw new Error(
                            `Failed to get order data for PROD: ${data.VPROD}, ORD_NO: ${data.VORD_NO}, ITEM: ${data.VITEM}, DRAWINGID: ${data.NDRAWINGID}`,
                        );
                    }
                    const orderData = orderRes.data;
                    const masterPath = orderData.FDP_DESCRIPTION.includes('(TEMP)') ? orderData.FDP_DESCRIPTION.replace('(TEMP)', '(IS)') : orderData.FDP_DESCRIPTION;
                    const tempPath = orderData.FDP_DESCRIPTION.includes('(TEMP)') ? orderData.FDP_DESCRIPTION : `${orderData.FDP_DESCRIPTION.replace('(IS)', '(TEMP)')}`;
                    console.log(masterPath, tempPath);

                    const moveFileRes = await moveFileFormPath({
                        originalPath: await joinPaths(masterPath, orderData.ORDDW_FILENAME),
                        destination: tempPath
                    });
                    if(!moveFileRes.status) {
                         throw new Error(
                            `Failed to move file from ${masterPath} to ${tempPath} for order PROD: ${data.VPROD}, ORD_NO: ${data.VORD_NO}, ITEM: ${data.VITEM}, DRAWINGID: ${data.NDRAWINGID}`,
                        );
                    }
                    targetPath.push(moveFileRes.path);
                    filesList.push({
                        masterPath,
                        tempPath,
                        fileName: orderData.ORDDW_FILENAME,
                    });
                }
                const empno = userData.SEMPNO;
                if (!listsByEmp[empno]) {
                    listsByEmp[empno] = {
                        EMAIL: userData.SRECMAIL,
                        USER_CREATE: userData.SNAME,
                        rows: [],
                    };
                }

                listsByEmp[empno].rows.push({
                    PROD: data.VPROD,
                    ORD_NO: data.VORD_NO,
                    ITEM: data.VITEM,
                    PROJECT: data.ordersDrawing.orders.ORD_PROJECT,
                    PATHNAME: data.ordersDrawing.ORDDW_PART,
                    DRAWING: data.ordersDrawing.ORDDW_DRAWING,
                    APPROVE: l.NSTATUS === 1,
                    USER_CREATE: userData.SNAME,
                    EMAIL: userData.SRECMAIL,
                });
            }
            for (const emp of Object.keys(listsByEmp)) {
                const empData = listsByEmp[emp];
                await this.mailService.sendMail({
                    to:
                        process.env.NODE_ENV != 'production'
                            ? process.env.MAIL_ADMIN
                            : empData.EMAIL,
                    subject: 'Auto check sheet return approve',
                    template: 'escs-return-approve',
                    context: {
                        toName: empData.USER_CREATE,
                        list: empData.rows,
                    },
                    bcc: process.env.MAIL_ADMIN,
                });
            }
            return {
                status: true,
                message: 'Return Successfully',
                targetPath,
            };
        } catch (error) {
            for (const file of filesList) {
                await moveFileFormPath({
                    originalPath: await joinPaths(file.tempPath, file.fileName),
                    destination: file.masterPath,
                });
            }
            throw new Error(`Failed to return: ${error.message}`);
        }
    }

    async findBySec(sec: number) {
        try {
            const res = await this.repo.findBySec(sec);
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to find ReturnApvList: ${error.message}`);
        }
    }

    async findById(id: number) {
        try {
            const res = await this.repo.findById(id);
            if (!res) {
                return {
                    status: false,
                    message: 'No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Data found 1 record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to find ReturnApvList: ${error.message}`);
        }
    }
}
