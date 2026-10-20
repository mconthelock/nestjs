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
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { GetMaxRunnoDto } from './dto/get-max-runno.dto';
import { InsertLogDto } from './dto/insert-log.dto';

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

    @Post('max-runno')
    @UseTransaction('workloadConnection')
    async maxRunno(@Body() dto: GetMaxRunnoDto) {
        return this.idtagEfacLogService.maxRunno(dto);
    }

    @Post('insert-log')
    @UseTransaction('workloadConnection')
    async insertLog(@Body() dto: InsertLogDto) {
        return this.idtagEfacLogService.insertLog(dto);
    }
}
