import { Controller, Get, Post, Body, Patch, Param, Delete ,Query,ParseIntPipe } from '@nestjs/common';
import { PappflowService } from './pappflow.service';
import { CreatePappflowDto } from './dto/create-pappflow.dto';
import { UpdatePappflowDto } from './dto/update-pappflow.dto';
import { PAPPFLOW } from 'src/common/Entities/amec/table/PAPPFLOW.entity';

@Controller('pappflow')
export class PappflowController {
  constructor(private readonly pappflowService: PappflowService) {}

  @Post()
  create(@Body() createPappflowDto: CreatePappflowDto) {
    return this.pappflowService.create(createPappflowDto);
  }

  @Get()
  findAll() {
    return this.pappflowService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pappflowService.findOne(+id);
  }

  @Get()
    async getFlowWithSteps(
        @Query('sLevel') sLevel: string,
        @Query('nStep', ParseIntPipe) nStep: number // ParseIntPipe ช่วยแปลง string จาก URL ให้เป็น number
    ): Promise<PAPPFLOW[]> {
        
        // ส่งค่าไปให้ Service ทำงานและส่งผลลัพธ์กลับไปให้ Client
        return await this.pappflowService.findFlowWithSteps(sLevel, nStep);
    }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePappflowDto: UpdatePappflowDto) {
    return this.pappflowService.update(+id, updatePappflowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pappflowService.remove(+id);
  }
}
