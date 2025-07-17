import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderpartsService } from './orderparts.service';
import { CreateOrderpartDto } from './dto/create-orderpart.dto';
import { UpdateOrderpartDto } from './dto/update-orderpart.dto';

@Controller('orderparts')
export class OrderpartsController {
  constructor(private readonly orderpartsService: OrderpartsService) {}

  @Post()
  create(@Body() createOrderpartDto: CreateOrderpartDto) {
    return this.orderpartsService.create(createOrderpartDto);
  }

  @Get()
  findAll() {
    return this.orderpartsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderpartsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderpartDto: UpdateOrderpartDto) {
    return this.orderpartsService.update(+id, updateOrderpartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderpartsService.remove(+id);
  }
}
