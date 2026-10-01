import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { SearchLoanDto } from './dto/search-loan.dto';

@Controller('gpreport/loan')
export class LoanController {
    constructor(private readonly loanService: LoanService) {}

    @Post('search')
    search(@Body() dto: SearchLoanDto) {
        return this.loanService.search(dto);
    }
}
