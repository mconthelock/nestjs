import { Controller, Post, Body, Req, Get, Query } from '@nestjs/common';
import { VpsService } from './vps.service';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';
import { InsertCartonDto, InsertListCartonDto } from './dto/insertCarton.dto';
import { SearchOrderDto } from 'src/escs/orders/dto/search-orders.dto';
import { ReprintSearchDto } from './dto/reprint-search.dto';
import { ReprintPackNoDto } from './dto/reprint-packno.dto';
import { ReprintPackingOrderDto } from './dto/reprintPackingOrder.dto';

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

    @Post('last-print-history')
    async lastPrintHistory(
        @Body('order') order: string,
        @Body('packing') packing: string,
    ) {
        const data = await this.vpsService.lastPrintHistory(order, packing);
        return {
            data,
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
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        await this.vpsService.insertPrintVPS(
            order,
            packing,
            qtyPrint,
            empno,
            ip,
        );
        return {
            success: true,
        };
    }

    @Post('reprint-packingorder')
    async reprintPackingOrder(
        @Body() dto: ReprintPackingOrderDto,
        @Body('reprintCause') reprintCause: string,
        @Body('remark') remark: string,
        @Req() req: Request,
    ) {
        const ip = getClientIP(req);
        await this.vpsService.reprintPackingOrder(
            dto.order,
            dto.packing,
            dto.qtyPrint,
            dto.empno,
            reprintCause,
            remark,
            ip,
        );

        return {
            success: true,
        };
    }

    @Post('get-order-detail')
    async getOrderDetail(
        @Body('order') order: string,
        @Body('packing') packing: string,
    ) {
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

    @Get('get-order-reprint')
    getOrderReprint(@Query() query: ReprintSearchDto) {
        return this.vpsService.getOrderReprint(
            query.search,
            query.page,
            query.sect,
        );
    }

    @Get('get-packno-reprint')
    getPackNoReprint(@Query() query: ReprintPackNoDto) {
        return this.vpsService.getPackNoReprint(query.orderno, query.sect);
    }

    @Get('get-data-carton-box')
    getDataCartonBox() {
        return this.vpsService.getDataCartonBox();
    }
}
