import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurevaScoreService } from './pureva_score.service';
import { CreatePurevaScoreDto } from './dto/create-pureva_score.dto';
import { UpdatePurevaScoreDto } from './dto/update-pureva_score.dto';

@Controller('pureva-score')
export class PurevaScoreController {
  constructor(private readonly purevaScoreService: PurevaScoreService) {}

  @Post()
  create(@Body() createPurevaScoreDto: CreatePurevaScoreDto) {
    return this.purevaScoreService.create(createPurevaScoreDto);
  }

  @Get()
  findAll() {
    return this.purevaScoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purevaScoreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurevaScoreDto: UpdatePurevaScoreDto) {
    return this.purevaScoreService.update(+id, updatePurevaScoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purevaScoreService.remove(+id);
  }
}
