import { PartialType } from '@nestjs/swagger';
import {
    IsString,
    IsNumber,
    IsOptional,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLoanFormDto } from './create-loan.dto';
import { SearchFormDto } from 'src/webform/form/dto/search-form.dto';

export class SearchEmp04 {
    @IsString()
    @IsOptional()
    EMPCOD?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    EHLTME?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    EHLADT?: number;

    @IsString()
    @IsOptional()
    EHLCNO?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    EHLPDT?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    EHLLMT?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    EHLPPD?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    EHLINT?: number;

    @IsString()
    @IsOptional()
    EHLRMK?: string;

    @IsString()
    @IsOptional()
    EDDDOC?: string;

    @IsString()
    @IsOptional()
    EDDDOC01?: string;

    @IsString()
    @IsOptional()
    EDDDOC02?: string;

    @IsString()
    @IsOptional()
    GRTCOD?: string;

    @IsString()
    @IsOptional()
    GRTNMT?: string;

    @IsString()
    @IsOptional()
    DEPABT?: string;

    @IsString()
    @IsOptional()
    POSTN?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    GRTDTE?: number;
}

export class SearchEmp05 {
    @IsString()
    @IsOptional()
    EMPCOD?: string;

    @IsString()
    @IsOptional()
    EHLCNO?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    EDLTRM?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    EDLPRD?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    EDLPDT?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    EDLPMT?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    EDLINT?: number;

    @IsString()
    @IsOptional()
    EDLSTS?: string;
}

export class SearchLoanDto {
    @ValidateNested()
    @IsOptional()
    @Type(() => SearchEmp04)
    guarantor?: SearchEmp04;

    @ValidateNested()
    @IsOptional()
    @Type(() => SearchEmp05)
    paid?: SearchEmp05;

    @ValidateNested()
    @IsOptional()
    @Type(() => SearchFormDto)
    form?: SearchFormDto;
}
