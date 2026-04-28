import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GetOrderService } from './get-order.service';
import { CreateGetOrderDto } from './dto/create-get-order.dto';
import { UpdateGetOrderDto } from './dto/update-get-order.dto';

@Controller('get-order')
export class GetOrderController {
  constructor(private readonly getOrderService: GetOrderService) {}

}
