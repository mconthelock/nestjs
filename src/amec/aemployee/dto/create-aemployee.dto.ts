import { IsString, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAemployeeDto {
    @IsString()
    SEMPNO: string;

    @IsString()
    SDIVCODE: string;

    @IsString()
    SDEPCODE: string;

    @IsString()
    SSECCODE: string;

    @IsString()
    SPOSCODE: string;

    @IsString()
    SNAME: string;

    @IsString()
    SSURNAME: string;

    @IsString()
    STNAME: string;

    @IsString()
    STSURNAME: string;

    @IsString()
    SLOGIN: string;

    @IsString()
    SPASSWORD: string;

    @IsString()
    CSTATUS: string;

    @IsString()
    CRECMAIL: string;

    @IsString()
    SRECMAIL: string;

    @Type(() => Date)
    @IsDate()
    STARTDATE: Date;

    @IsString()
    CLEVEL: string;

    @IsString()
    @Type(() => Number)
    @IsNumber()
    NTELNO: number;

    @IsString()
    @Type(() => Number)
    @IsNumber()
    NISMSTATUS: number;

    @IsString()
    @Type(() => Date)
    @IsDate()
    DUPDATE: Date;

    @IsString()
    SPASSWORD1: string;

    @IsString()
    SPASSWORD2: string;

    @IsString()
    SPASSWORD3: string;

    @IsString()
    @Type(() => Date)
    @IsDate()
    RESIGNDATE: Date;

    @IsString()
    JOBTYPE: string;

    @IsString()
    @Type(() => Date)
    @IsDate()
    CREUSRDATE: Date;

    @IsString()
    @Type(() => Date)
    @IsDate()
    UPDUSRDATE: Date;

    @IsString()
    VPSNID: string;

    @IsString()
    MELGIT: string;
}
