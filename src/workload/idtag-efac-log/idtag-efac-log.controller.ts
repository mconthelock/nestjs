import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IdtagEfacLogService } from './idtag-efac-log.service';
import { CreateIdtagEfacLogDto } from './dto/create-idtag-efac-log.dto';
import { UpdateIdtagEfacLogDto } from './dto/update-idtag-efac-log.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('workload/idtag-efac-log')
export class IdtagEfacLogController {
  constructor(private readonly idtagEfacLogService: IdtagEfacLogService) {}

  @Get()
  findAll() {
    return this.idtagEfacLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.idtagEfacLogService.findOne(+id);
  }

  @Post('search')
  @UseTransaction('workloadConnection')
  async search(@Body() dto: FiltersDto) {
    return this.idtagEfacLogService.search(dto);
  }
}
