import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderListService } from './orderlist.service';
import { SearchOrderListDto } from './dto/search-orderlist.dto';

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
  // ถ้าไม่ใช้ @UseGuards จะไม่ต้อง login ก็ได้ แต่จะไม่มีการตรวจสอบสิทธิ์
  @UseGuards(AuthGuard('jwt')) // ต้อง login เพื่อได้ cookie ถึงจะมีสิทธิ์เรียกใช้
  async search(@Body() dto: SearchOrderListDto) {
    // dto จะเก็บค่าที่ client post มา (body) เช่น { keyword: "แจ๊บ", date: "2024-06-03" }
    if(dto.search || dto.limit || dto.page) {
      // ถ้า client ส่ง search, limit, page มา จะต้องมีการจัดการ pagination และ search
        return this.OrderListService.serversite(dto);
    }else{
        return this.OrderListService.search(dto);
    }
  }
}
