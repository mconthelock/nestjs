import { Controller, Get } from '@nestjs/common';
import { TermcodeService } from './termcode.service';

@Controller('pursys/termcode')
export class TermcodeController {
    constructor(private readonly term: TermcodeService) {}

    @Get('payment')
    findPayment() {
        return this.term.findPayment();
    }

    @Get('trade')
    findTrade() {
        return this.term.findTrade();
    }
}
