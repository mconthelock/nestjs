import { Controller, Post, Body, Req } from '@nestjs/common';
import { VpsService } from './vps.service';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';

@Controller('vps')
export class VpsController {
    constructor(private readonly vpsService: VpsService) {}

    @Post('chk-print')
    async chkPrint(
        @Body('order') order: string,
        @Body('packing') packing: string,
    ) {
        const found = await this.vpsService.chkPrint(order, packing);

        return {
            success: found,
        };
    }

    @Post('get-detail-pis')
    async getDetailPIS(@Body('packing') packing: string) {
        const data = await this.vpsService.getDetailPIS(packing);
        return {
            success: true,
            data,
        };
    }

    @Post('get-vps-detail')
    async getVPSDetail(
        @Body('order') order: string,
        @Body('packing') packing: string,
    ) {
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
        @Req() req: Request
    ) {
        const ip = getClientIP(req);
        await this.vpsService.insertPrintVPS(order, packing, qtyPrint, empno, ip);
        return {
            success: true,
        };
    }
}
