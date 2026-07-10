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

@Controller('ps-yic')
export class PsYicController {
    constructor(private readonly psYicService: PsYicService) {}

    @Post('get-form-data')
    async getFormData(@Body() dto: FormDto) {
        return this.psYicService.getFormData(dto);
    }
}
