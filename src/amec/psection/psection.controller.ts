import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PsectionService } from './psection.service';
import { CreatePsectionDto } from './dto/create-psection.dto';
import { UpdatePsectionDto } from './dto/update-psection.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('amec/section')
export class PsectionController {
  constructor(private readonly psectionService: PsectionService) {}

  @Post()
  create(@Body() createPsectionDto: CreatePsectionDto) {
    return this.psectionService.create(createPsectionDto);
  }

  @Get()
  findAll() {
    return this.psectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.psectionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePsectionDto: UpdatePsectionDto,
  ) {
    return this.psectionService.update(+id, updatePsectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.psectionService.remove(+id);
  }
}
