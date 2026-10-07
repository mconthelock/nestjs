import { PartialType } from '@nestjs/swagger';
import { CreateLoanFormDto } from './create-loan.dto';

export class UpdateLoanDto extends PartialType(CreateLoanFormDto) {}
