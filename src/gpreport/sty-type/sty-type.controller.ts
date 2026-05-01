import {
    Controller,
    Get,
    Param,
} from '@nestjs/common';
import { StyTypeService } from './sty-type.service';
import { CreateStyTypeDto } from './dto/create-sty-type.dto';
import { UpdateStyTypeDto } from './dto/update-sty-type.dto';

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
}
