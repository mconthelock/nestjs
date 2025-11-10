import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { ChemicalSectionService } from './chemical-section.service';
import { CreateChemicalSectionDto } from './dto/create-chemical-section.dto';
import { UpdateChemicalSectionDto } from './dto/update-chemical-section.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('safety/chemical-section')
export class ChemicalSectionController {
  constructor(
    private readonly chemicalSectionService: ChemicalSectionService,
  ) {}

  @Patch('update')
  @UseInterceptors(AnyFilesInterceptor())
  async update(@Body() dto: UpdateChemicalSectionDto) {
    return await this.chemicalSectionService.update(dto);
  }
}
