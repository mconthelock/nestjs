import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';

export class CreateLoanFormDto extends PartialType(CreateFormDto) {
    @IsString()
    LOANNO: string;

    @IsNumber()
    @Type(() => Number)
    LOANAMT: number;

    @IsNumber()
    @Type(() => Number)
    LID_PUR: number;

    @IsDate()
    @Type(() => Date)
    DUEDATE: Date;

    @IsString()
    DETAIL: string;

    @IsDate()
    @Type(() => Date)
    PAYDATE: Date;
}
