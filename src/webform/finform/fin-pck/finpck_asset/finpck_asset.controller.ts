import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FinpckAssetService } from './finpck_asset.service';
import { CreateFinpckAssetDto } from './dto/create-finpck_asset.dto';
import { UpdateFinpckAssetDto } from './dto/update-finpck_asset.dto';

@Controller('finpck-asset')
export class FinpckAssetController {
  constructor(private readonly finpckAssetService: FinpckAssetService) {}

  @Post()
  create(@Body() createFinpckAssetDto: CreateFinpckAssetDto) {
    return this.finpckAssetService.create(createFinpckAssetDto);
  }

  @Get()
  findAll() {
    return this.finpckAssetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finpckAssetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinpckAssetDto: UpdateFinpckAssetDto) {
    return this.finpckAssetService.update(+id, updateFinpckAssetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finpckAssetService.remove(+id);
  }
}
