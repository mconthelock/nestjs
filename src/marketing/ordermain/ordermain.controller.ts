import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdermainService } from './ordermain.service';
import { CreateOrdermainDto } from './dto/create-ordermain.dto';
import { UpdateOrdermainDto } from './dto/update-ordermain.dto';

@Controller('ordermain')
export class OrdermainController {
  constructor(private readonly ordermainService: OrdermainService) {}

  @Post()
  create(@Body() createOrdermainDto: CreateOrdermainDto) {
    return this.ordermainService.create(createOrdermainDto);
  }

  @Get()
  findAll() {
    return this.ordermainService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordermainService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdermainDto: UpdateOrdermainDto) {
    return this.ordermainService.update(+id, updateOrdermainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordermainService.remove(+id);
  }
}
