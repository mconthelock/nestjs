import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderListService } from './orderlist.service';
import { CreateOrderListDto } from './dto/create-orderlist.dto';
import { UpdateOrderListDto } from './dto/update-orderlistr.dto';
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
  async search(@Body() dto: SearchOrderListDto) {
    console.log('dto', dto.PRNO);

    // dto จะเก็บค่าที่ client post มา (body) เช่น { keyword: "แจ๊บ", date: "2024-06-03" }
    return this.OrderListService.search(dto);
  }
}
