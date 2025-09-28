import { Controller, Get } from '@nestjs/common';
import { DesignerService } from './designer.service';

@Controller('sp/designer')
export class DesignerController {
  constructor(private readonly des: DesignerService) {}

  @Get('all')
  getAll() {
    return this.des.getAll();
  }
}
