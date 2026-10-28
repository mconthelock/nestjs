import { Controller, Body, Patch, UseInterceptors } from '@nestjs/common';
import { ChemicalSectionService } from './chemical-section.service';
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
