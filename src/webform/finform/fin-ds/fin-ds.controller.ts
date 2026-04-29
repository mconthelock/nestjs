import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FinDsService } from './fin-ds.service';
import { CreateFinDDto } from './dto/create-fin-d.dto';
import { UpdateFinDDto } from './dto/update-fin-d.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';

@Controller('finform/fin-ds')
export class FinDsController {
  constructor(private readonly finDsService: FinDsService) {}



  @Get()
  findAll() {
    return this.finDsService.findAll();
  }

  @Post()
  @UseTransaction('webformconnection')
  create(@Body() createFinDDto: CreateFinDDto) {
    return this.finDsService.create(createFinDDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.finDsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFinDDto: UpdateFinDDto) {
  //   return this.finDsService.update(+id, updateFinDDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.finDsService.remove(+id);
  // }
}
