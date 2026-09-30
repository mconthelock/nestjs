import { PartialType } from '@nestjs/swagger';
import { CreateLoanDto } from './create-loan.dto';

export class SearchLoanDto extends PartialType(CreateLoanDto) {}
