import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { PsYicService } from './ps-yic.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { INV_YEARLY_RESULT } from 'src/common/Entities/skid/table/INV_YEARLY_RESULT.entity';
import { FindOptionsWhere, QueryDeepPartialEntity } from 'typeorm';
import { PSYIC_FORM } from 'src/common/Entities/webform/table/PSYIC_FORM.entity';

@Controller('ps-yic')
export class PsYicController {
    constructor(private readonly psYicService: PsYicService) {}

    @Post('get-form-data')
    async getFormData(@Body() dto: FormDto) {
        return this.psYicService.getFormData(dto);
    }

    @Patch('updateYearlyResult')
    updateYearlyResult(
        @Body()
        body: {
            where: FindOptionsWhere<INV_YEARLY_RESULT>;
            data: QueryDeepPartialEntity<INV_YEARLY_RESULT>;
        },
    ) {
        return this.psYicService.updateYearlyResult(body.where, body.data);
    }

    @Patch('update-variance')
    updateFormData(
        @Body()
        body: {
            where: FindOptionsWhere<PSYIC_FORM>;
            data: QueryDeepPartialEntity<PSYIC_FORM>;
        },
    ) {
        return this.psYicService.updateFormData(body.where, body.data);
    }
}
