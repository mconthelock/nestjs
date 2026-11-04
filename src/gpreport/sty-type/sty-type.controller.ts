import {
    Controller,
    Get,
    Param,
} from '@nestjs/common';
import { StyTypeService } from './sty-type.service';

@Controller('gpreport/sty-type')
export class StyTypeController {
    constructor(private readonly styTypeService: StyTypeService) {}

    @Get('findByTypeCode/:typecode')
    findByTypeCode(@Param('typecode') typecode: string) {
        return this.styTypeService.findByTypeCode(typecode);
    }

    @Get('class')
    getClass(){
        return this.styTypeService.findByTypeCode('PTC');
    }

    @Get('chemical/class')
    getChemicalClass(){
        return this.styTypeService.findByTypeCode('CMC');
    }
}
