import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderListService } from './orderlist.service';
import { SearchOrderListDto } from './dto/search-orderlist.dto';
import { SetRequestDateService } from '../set-request-date/set-request-date.service';
import { numberToAlphabetRevision } from 'src/common/utils/format.utils';
import pLimit from 'p-limit';

// @UseGuards(AuthGuard('jwt')) // ต้อง login เพื่อได้ cookie ถึงจะมีสิทธิ์เรียกใช้  ถ้าไม่ใช้ @UseGuards จะไม่ต้อง login ก็ได้ แต่จะไม่มีการตรวจสอบสิทธิ์
@Controller('joborder')
export class OrderListController {
  constructor(
    private readonly OrderListService: OrderListService,
    private readonly setRequestDateService: SetRequestDateService,
  ) {}

  @Post('orderlist')
  async orderlist(@Body() dto: SearchOrderListDto) {
    return this.OrderListService.orderlist(dto);
  }

  @Post('orderlistNew')
  async orderlistNew(@Body() dto: SearchOrderListDto) {
    const orderList = await this.OrderListService.orderlistNew(dto);
    return orderList;
  }

  // ถ้า client ส่ง search, limit, page มา จะต้องมีการจัดการ pagination และ search
  @Post('orderlistByPage')
  async orderlistByPage(@Body() dto: SearchOrderListDto) {
    return this.OrderListService.orderlistByPage(dto);
  }

  @Post('orderlist/confirm')
  async confirm(@Body() dto: SearchOrderListDto) {
    const orderList = await this.OrderListService.confirm(dto);
    return orderList;
  }

  @Post('orderlist/shipment')
  async shipment(@Body() dto: SearchOrderListDto) {
    const orderList = await this.OrderListService.shipment(dto);
    return orderList;
  }

}
