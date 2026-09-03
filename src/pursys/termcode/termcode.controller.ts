import { Controller, Get } from '@nestjs/common';
import { TermcodeService } from './termcode.service';

@Controller('pursys/termcode')
export class TermcodeController {
    constructor(private readonly turmcodeService: TermcodeService) {}

    @Get()
    findAll() {
        return this.turmcodeService.findAll();
    }
}
