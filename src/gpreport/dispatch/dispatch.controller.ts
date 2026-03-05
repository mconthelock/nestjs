import { Body, Controller, Post } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { GetOrInitDto } from './dto/get-or-init.dto';
import { SaveDispatchDto } from './dto/save-dispatch.dto';
import { SaveOverwriteDto } from './dto/save-overwrite.dto';
import { BuildDailyFirstDto } from './dto/build-daily-first.dto';
import { DispatchKeyDto } from './dto/dispatch-key.dto';


@Controller('bus/dispatch')
export class DispatchController {
  constructor(private readonly service: DispatchService) {}
  @Post('get-dispatch')
  get(@Body() dto: DispatchKeyDto) {
    return this.service.getDispatch(dto);
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