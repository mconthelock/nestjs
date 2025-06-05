import { Controller, Get, Post, Body, Param, UseGuards, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderListService } from './orderlist.service';
import { SearchOrderListDto } from './dto/search-orderlist.dto';

// @UseGuards(AuthGuard('jwt')) // ต้อง login เพื่อได้ cookie ถึงจะมีสิทธิ์เรียกใช้  ถ้าไม่ใช้ @UseGuards จะไม่ต้อง login ก็ได้ แต่จะไม่มีการตรวจสอบสิทธิ์
@Controller('joborder')
export class OrderListController {
  constructor(private readonly OrderListService: OrderListService) {}

 
  @Get()
  findAll() {
    return this.OrderListService.findAll();
  }

  @Get(':PRNO')
  findOne(@Param('PRNO') PRNO: number) {
    return this.OrderListService.findOne(PRNO);
  }

  @Post('search')   
  @HttpCode(200) // ตั้งค่าให้ response เป็น 200 OK แทนที่จะเป็น 201 Created
  async search(@Body() dto: SearchOrderListDto) { // dto จะเก็บค่าที่ client post มา (body) เช่น { PRNO: "41250732", "MFGNO" : "EXIO18012" }
    return this.OrderListService.search(dto);
  }

  // ถ้า client ส่ง search, limit, page มา จะต้องมีการจัดการ pagination และ search
  @Post('searchByPage')
  @HttpCode(200) // ตั้งค่าให้ response เป็น 200 OK แทนที่จะเป็น 201 Created
  async searchByPage(@Body() dto: SearchOrderListDto) {
    return this.OrderListService.searchByPage(dto);
  }
}
