import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CmSmService } from './cm-sm.service';
import { UpdateCmSmDto } from './dto/update-cm-sm.dto';

@Controller('cm-sm')
export class CmSmController {
  constructor(private readonly cmSmService: CmSmService) {}

  @Post('save')
  save(@Body() payload: UpdateCmSmDto) {
    return this.cmSmService.save(payload);
  }

  @Get()
  findAll() {
    return this.cmSmService.findAll();
  }

  @Post('alert-email')
  alertEmail(
    @Query('TINO') TINO: string,
    @Query('REVNO') REVNO: string,
    @Query('empno') empno: string,
  ) {
    return this.cmSmService.alertEmail(TINO, REVNO, empno);
  }
}
