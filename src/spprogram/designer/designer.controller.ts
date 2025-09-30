import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { DesignerService } from './designer.service';

@Controller('sp/designer')
export class DesignerController {
  constructor(private readonly des: DesignerService) {}

  @Get('all')
  getAll() {
    return this.des.getAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.des.update(data, id);
  }
}
