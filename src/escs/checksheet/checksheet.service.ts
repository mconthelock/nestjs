import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ChecksheetRepository } from './checksheet.repository';
import { InCheckDto } from './dto/in-check.dto';
import { SaveDto } from './dto/save.dto';
import { DeleteDto } from './dto/delete.dto';
import { ChecksheetResponseDto } from './dto/response.dto';
import { GetOrderDto } from './dto/get-order.dto';
import { GetOrderResponseDto } from './dto/get-order-response.dto';
import { ChecksheetProc } from './enums/proc.enum';
import { GetOrderService } from '../get-order/get-order.service';

@Injectable()
export class ChecksheetService {
    constructor(
        private readonly repo: ChecksheetRepository,
        private readonly ordservice: GetOrderService,
    ) {}

    async getOrder(dto: GetOrderDto): Promise<GetOrderResponseDto | null> {
        try {
            const res = await this.ordservice.getOrder(dto);
            if (!res?.length) {
                throw new NotFoundException('Order not found');
            }

            const { ORDERNO, TYPE_MODEL } = res[0];
            return {
                orderNo: ORDERNO,
                typeModel: TYPE_MODEL
            };
        } catch (err) {
            if (err instanceof NotFoundException) throw err;

            throw new InternalServerErrorException({
                message: 'GET_ORDER failed',
                error: err?.message
            });
        }
    }

    async inCheck(dto: InCheckDto): Promise<ChecksheetResponseDto> {
        try {
            const res = await this.repo.getInCheck(dto);
            return {
                status: 'SUCCESS',
                message: res.length ? null : 'No data found',
                data: res
            };
        } catch (err) {
            throw new InternalServerErrorException('IN_CHECK failed');
        }
    }

    async save(dto: SaveDto): Promise<ChecksheetResponseDto> {
        try {
            const procedure = this.mapActionToProcedure(dto.action);
            await this.repo.saveAction(procedure, dto);
            return {
                status: 'SUCCESS',
                message: 'Saved successfully',
                data: null
            };
        } catch (err) {
            throw new InternalServerErrorException('SAVE failed');
        }
    }

    async delete(dto: DeleteDto): Promise<ChecksheetResponseDto> {
        return {
            status: 'SUCCESS',
            message: `Deleted ${dto.filename}`,
            data: null
        };
    }

    private readonly actionProcedureMap: Record<string, ChecksheetProc> = {
        draft: ChecksheetProc.IN_DRAFT,
        submit: ChecksheetProc.IN_SUBMIT,
        edit: ChecksheetProc.FL_EDIT
    };

    private mapActionToProcedure(action: string): ChecksheetProc {
        const procedure = this.actionProcedureMap[action];

        if (!procedure) {
            throw new Error(`Invalid action: ${action}`);
        }

        return procedure;
    }
}