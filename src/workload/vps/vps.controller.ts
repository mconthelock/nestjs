import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { VpsService } from './vps.service';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import { InsertCartonDto, InsertListCartonDto } from './dto/insertCarton.dto';

@Controller('vps')
export class VpsController {
    constructor(private readonly vpsService: VpsService) {}

    @Post('chk-print')
    async chkPrint(@Body('order') order: string, @Body('packing') packing: string) {
        const found = await this.vpsService.chkPrint(order, packing);

        return {
            success: found,
        };
    }

    @Post('get-list-order')
    async getListOrder(@Body('packing') packing: string) {
        const data = await this.vpsService.getListOrder(packing);
        return {
            data,
        };
    }

    @Get('get-list-order-88-89')
    async getListOrder_88_89() {
        const data = await this.vpsService.getListOrder_88_89();
        return {
            data,
        };
    }

    @Post('get-vps-detail')
    async getVPSDetail(@Body('order') order: string, @Body('packing') packing: string) {
        const data = await this.vpsService.getVPSDetail(order, packing);
        return {
            success: true,
            data,
        };
    }

    @Post('insert-print-vps')
    async insertPrintVPS(
        @Body('order') order: string,
        @Body('packing') packing: string,
        @Body('qtyPrint') qtyPrint: number,
        @Body('empno') empno: string,
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        await this.vpsService.insertPrintVPS(order, packing, qtyPrint, empno, ip);
        return {
            success: true,
        };
    }

    @Post('get-order-detail')
    async getOrderDetail(@Body('order') order: string, @Body('packing') packing: string) {
        const data = await this.vpsService.getOrderDetail(order, packing);

        return {
            data,
        };
    }

    @Post('save-carton-box')
    async insertCartonBox(@Body() dto: InsertListCartonDto) {
        const result = await this.vpsService.insertCartonBox(dto);
        return {
            success: true,
            data: result,
        };
    }
}
