import { Injectable } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { SearchLoanDto } from './dto/search-loan.dto';

@Injectable()
export class LoanService {
    search(dto: SearchLoanDto) {
        return 'This action adds a new loan';
    }
}
