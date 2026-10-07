import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendLoanMailDto {
    @IsEmail()
    to: string;

    @IsOptional()
    @IsString()
    subject?: string;

    @IsOptional()
    @IsString()
    message?: string;

    @IsOptional()
    @IsString()
    message_ps?: string;

    @IsOptional()
    @IsString()
    recipientName?: string;

    @IsOptional()
    @IsString()
    sdate?: string;

    // JSON string of LoanMailRow[] (multipart field)
    @IsNotEmpty()
    @IsString()
    data: string;
}

export interface LoanMailRow {
    LOANNO: string;
    SEMPNO: string;
    STNAME: string;
    SPOSNAME: string;
    SSEC: string;
    PAYDATE: string;
    AMOUNT: string;
}
