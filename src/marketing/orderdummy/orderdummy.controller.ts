import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderdummyService } from './orderdummy.service';
import { CreateOrderdummyDto } from './dto/create-orderdummy.dto';
import { UpdateOrderdummyDto } from './dto/update-orderdummy.dto';

@Controller('orderdummy')
export class OrderdummyController {
  constructor(private readonly orderdummyService: OrderdummyService) {}

  @Post()
  create(@Body() createOrderdummyDto: CreateOrderdummyDto) {
    return this.orderdummyService.create(createOrderdummyDto);
  }

  @Get()
  findAll() {
    return this.orderdummyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderdummyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderdummyDto: UpdateOrderdummyDto) {
    return this.orderdummyService.update(+id, updateOrderdummyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderdummyService.remove(+id);
  }
}
