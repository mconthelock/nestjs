import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
