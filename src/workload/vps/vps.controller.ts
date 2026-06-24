import { Controller, Post, Body } from '@nestjs/common';
import { VpsService } from './vps.service';

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
}
