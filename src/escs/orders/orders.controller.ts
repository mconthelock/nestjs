import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ESCSOrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SearchOrderDto } from './dto/search-orders.dto';

@Controller('escs/orders')
export class ESCSOrdersController {
  constructor(private readonly ordersService: ESCSOrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  @Post('checkOrderPartSupply')
    checkOrderPartSupply(@Body() dto: SearchOrderDto) {
        return this.ordersService.checkOrderPartSupply(dto);
    }

}
