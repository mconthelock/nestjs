import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurevaProfitTurnoverService } from './pureva_profit_turnover.service';
import { CreatePurevaProfitTurnoverDto } from './dto/create-pureva_profit_turnover.dto';
import { UpdatePurevaProfitTurnoverDto } from './dto/update-pureva_profit_turnover.dto';

@Controller('pureva-profit-turnover')
export class PurevaProfitTurnoverController {
  constructor(private readonly purevaProfitTurnoverService: PurevaProfitTurnoverService) {}

  @Post()
  create(@Body() createPurevaProfitTurnoverDto: CreatePurevaProfitTurnoverDto) {
    return this.purevaProfitTurnoverService.create(createPurevaProfitTurnoverDto);
  }

  @Get()
  findAll() {
    return this.purevaProfitTurnoverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purevaProfitTurnoverService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurevaProfitTurnoverDto: UpdatePurevaProfitTurnoverDto) {
    return this.purevaProfitTurnoverService.update(+id, updatePurevaProfitTurnoverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purevaProfitTurnoverService.remove(+id);
  }
}
