import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { FinPckService } from './fin-pck.service';
import { CreateFinPckDto } from './dto/create-fin-pck.dto';
import { UpdateFinPckDto } from './dto/update-fin-pck.dto';
import { RequestFinpckFormDto } from './dto/request-fin-pck.dto';
import { UseForceTransaction, UseTransaction } from 'src/common/decorator/transaction.decorator';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';

@Controller('finform/fin-pck')
export class FinPckController {
  constructor(private readonly finPckService: FinPckService) {}

  
  @Post()
  @UseTransaction('webformConnection')
  @UseForceTransaction()
     create(
          @Body() dto: RequestFinpckFormDto,
          @Req() req: Request,
      ) {
          const ip = getClientIP(req);
          return this.finPckService.request(dto, ip);
      }

  @Get()
  findAll() {
    return this.finPckService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finPckService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinPckDto: UpdateFinPckDto) {
    return this.finPckService.update(+id, updateFinPckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finPckService.remove(+id);
  }
}
