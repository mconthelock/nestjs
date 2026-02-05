import { Controller, Post, Body } from '@nestjs/common';
import { BusstopService } from './busstop.service';
import { CreateBusstopDto } from './dto/create-busstop.dto';
import { UpdateBusstopDto } from './dto/update-busstop.dto';
import { SearchBusstopDto } from './dto/search-busstop.dto';

@Controller('bus/stop')
export class BusstopController {
  constructor(private readonly stop: BusstopService) {}

  @Post('create')
  create(@Body() dto: CreateBusstopDto) {
    return this.stop.create(dto);
  }

  @Post('update')
  update(@Body() dto: UpdateBusstopDto) {
    return this.stop.update(dto);
  }

  @Post('delete')
  delete(@Body() dto: UpdateBusstopDto) {
    return this.stop.update({ STOP_ID: dto.STOP_ID, STOP_STATUS: '0' });
  }

  @Post('search')
  find(@Body() dto: SearchBusstopDto) {
    return this.stop.findAll(dto);
  }
}
