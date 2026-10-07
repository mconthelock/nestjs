import { Controller, Get, Param } from '@nestjs/common';
import { MedicalService } from './medical.service';

import { CreateMedicalDto } from './dto/create-medical.dto';
import { UpdateMedicalDto } from './dto/update-medical.dto';

@Controller('gpreport/medical')
export class MedicalController {
    constructor(private readonly medicalService: MedicalService) {}

    @Get('right/:sempno/:opdyear')
    findRight(
        @Param('sempno') sempno: string,
        @Param('opdyear') opdyear: string,
    ) {
        return this.medicalService.findRight(sempno, opdyear);
    }

    @Get('forms/:sempno/:opdyear')
    findForms(
        @Param('sempno') sempno: string,
        @Param('opdyear') opdyear: string,
    ) {
        return this.medicalService.findForms(sempno, opdyear);
    }
}
