import { Body, Controller, Post } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { GetOrInitDto } from './dto/get-or-init.dto';
import { SaveDispatchDto } from './dto/save-dispatch.dto';
import { SaveOverwriteDto } from './dto/save-overwrite.dto';
import { BuildDailyFirstDto } from './dto/build-daily-first.dto';

@Controller('bus/dispatch')
export class DispatchController {
  constructor(private readonly service: DispatchService) {}

  @Post('get-or-init')
  getOrInit(@Body() dto: GetOrInitDto) {
    return this.service.getOrInit(dto);
  }

  @Post('save-overwrite')
  saveOverwrite(@Body() dto: SaveOverwriteDto) {
    return this.service.saveOverwrite(dto);
  }

  @Post('build-daily-first')
  buildDailyFirst(@Body() dto: BuildDailyFirstDto) {
    return this.service.buildDailyFirst(dto);
  }
}