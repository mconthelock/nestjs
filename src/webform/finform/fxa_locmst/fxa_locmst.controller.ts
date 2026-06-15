import { Controller, Get, Post, Body, Patch, Param, Delete , Query } from '@nestjs/common';
import { FxaLocmstService } from './fxa_locmst.service';
import { CreateFxaLocmstDto } from './dto/create-fxa_locmst.dto';
import { UpdateFxaLocmstDto } from './dto/update-fxa_locmst.dto';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('finform/fxa-locmst')
export class FxaLocmstController {
  constructor(private readonly fxaLocmstService: FxaLocmstService) {}

  @Post()
  create(@Body() createFxaLocmstDto: CreateFxaLocmstDto) {
    return this.fxaLocmstService.create(createFxaLocmstDto);
  }

  @Get()
  async findAll() {
    return this.fxaLocmstService.findAll();
  }

  
  @Get('search') // จะได้ Endpoint เป็น GET /locations/search
    async search(@Query() dto: FiltersDto) {
        // เรียกใช้ฟังก์ชัน search ที่คุณเพิ่งเขียนใน Service
        return this.fxaLocmstService.search(dto); 
    }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fxaLocmstService.findOne(+id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFxaLocmstDto: UpdateFxaLocmstDto) {
    return this.fxaLocmstService.update(+id, updateFxaLocmstDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fxaLocmstService.remove(+id);
  }
}
