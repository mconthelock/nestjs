import { Controller, Get, Post, Body, Param, UseGuards, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderListService } from './orderlist.service';
import { SearchOrderListDto } from './dto/search-orderlist.dto';

// @UseGuards(AuthGuard('jwt')) // ต้อง login เพื่อได้ cookie ถึงจะมีสิทธิ์เรียกใช้  ถ้าไม่ใช้ @UseGuards จะไม่ต้อง login ก็ได้ แต่จะไม่มีการตรวจสอบสิทธิ์
@Controller('joborder')
export class OrderListController {
    constructor(private readonly OrderListService: OrderListService) {}

    @Post('orderlist')   
    @HttpCode(200) // ตั้งค่าให้ response เป็น 200 OK แทนที่จะเป็น 201 Created
    async orderlist(@Body() dto: SearchOrderListDto) { // dto จะเก็บค่าที่ client post มา (body) เช่น { PRNO: "41250732", "MFGNO" : "EXIO18012" }
        return this.OrderListService.orderlist(dto);
    }

    // ถ้า client ส่ง search, limit, page มา จะต้องมีการจัดการ pagination และ search
    @Post('orderlistByPage')
    @HttpCode(200) // ตั้งค่าให้ response เป็น 200 OK แทนที่จะเป็น 201 Created
    async orderlistByPage(@Body() dto: SearchOrderListDto) {
        return this.OrderListService.orderlistByPage(dto);
    }

    @Post('orderlist/confirm') 
    @HttpCode(200) // ตั้งค่าให้ response เป็น 200 OK แทนที่จะเป็น 201 Created
    async confirm(@Body() dto: SearchOrderListDto) {
        return this.OrderListService.confirm(dto);
    }

     @Post('orderlist/shipment') 
    @HttpCode(200) // ตั้งค่าให้ response เป็น 200 OK แทนที่จะเป็น 201 Created
    async shipment(@Body() dto: SearchOrderListDto) {
        return this.OrderListService.shipment(dto);
    }

    // Task หนัก: Loop ใหญ่ที่ block Event Loop
    @Get('heavy')
    async heavyTask() {
        const start = Date.now();
        let sum = 0;
        
        // วน loop ไปเรื่อย ๆ จนกว่าจะครบ 10 วินาที
        while (Date.now() - start < 10_000) {
            for (let i = 0; i < 1e5; i++) {
            sum += i;
            }
        }
    }

}
