import { Injectable } from '@nestjs/common';
import { CreateReturnApvListDto } from './dto/create-return-apv-list.dto';
import { UpdateReturnApvListDto } from './dto/update-return-apv-list.dto';
import { ReturnApvListRepository } from './return-apv-list.repository';
import { OrdersDrawingService } from '../orders-drawing/orders-drawing.service';
import { MailService } from 'src/common/services/mail/mail.service';

@Injectable()
export class ReturnApvListService {
    constructor(
        private readonly repo: ReturnApvListRepository,
        private readonly orderDrawingService: OrdersDrawingService,
        private readonly mailService: MailService,
    ) {}

    async upsert(dto: CreateReturnApvListDto | UpdateReturnApvListDto) {
        try {
            const res = await this.repo.upsert(dto);
            if (!res) {
                return {
                    status: false,
                    message: 'Upsert ReturnApvList Failed',
                    data: dto,
                };
            }
            return {
                status: true,
                message: 'Upsert ReturnApvList Successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to upsert ReturnApvList: ${error.message}`);
        }
    }

    async return(dto: CreateReturnApvListDto) {
        try {
            await this.repo.upsert(dto);
            await this.orderDrawingService.update({
                ORD_PRODUCTION: dto.VPROD,
                ORD_ITEM: dto.VITEM,
                ORD_NO: dto.VORD_NO,
                ORDDW_ID: dto.NDRAWINGID,
                ORDDW_FORELEAD_STATUS: 8,
            });
            return {
                status: true,
                message: 'Return Successfully',
            };
        } catch (error) {
            throw new Error(`Failed to return: ${error.message}`);
        }
    }

    async actions(dto: UpdateReturnApvListDto) {
        try {
            const status = dto.NSTATUS === 1 ? 5 : dto.NSTATUS === 2 ? 7 : 8;
            await this.repo.upsert(dto);
            await this.orderDrawingService.update({
                ORD_PRODUCTION: dto.VPROD,
                ORD_ITEM: dto.VITEM,
                ORD_NO: dto.VORD_NO,
                ORDDW_ID: dto.NDRAWINGID,
                ORDDW_FORELEAD_STATUS: status,
            });
            // const
            // if(dto.NSTATUS === 1) {
            //     await this.mailService.sendMail({
            //         to: 'example@example.com',
            //         subject: 'Status Update',
            //         html: 'The status has been updated to 1.',
            //     });

            // }
            return {
                status: true,
                message: 'Return Successfully',
            };
        } catch (error) {
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
}
