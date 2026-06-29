import { Controller, Get, Post, Body, Patch, Param, Delete , ParseArrayPipe } from '@nestjs/common';
import { FinpckAssetService } from './finpck_asset.service';
import { CreateFinpckAssetDto } from './dto/create-finpck_asset.dto';
import { UpdateFinpckAssetDto } from './dto/update-finpck_asset.dto';

@Controller('finform/finpck-asset')
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

  @Patch('updateasset') 
  async updateMultipleAssets(
    // ใช้ ParseArrayPipe เพื่อบังคับให้ Validate ข้อมูลที่เป็น Array ทีละตัว
    @Body(new ParseArrayPipe({ items: UpdateFinpckAssetDto })) 
    assetsDto: UpdateFinpckAssetDto[],
  ) {
    // โยนข้อมูลไปให้ Service จัดการ และ Return ผลลัพธ์กลับไปให้ Client
    return this.finpckAssetService.updateMultipleAssets(assetsDto);
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
