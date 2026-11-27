import { Body, Controller, Patch, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UpdateChemicalSectionDto } from '../dto/update-chemical-section.dto';
import { SectionService } from '../services/section.service';

@Controller('safety/chemical-section')
export class SectionController {
    constructor(private readonly service: SectionService) {}

    @Patch('update')
    @UseInterceptors(AnyFilesInterceptor())
    async update(@Body() dto: UpdateChemicalSectionDto) {
        return await this.service.update(dto);
    }
}
