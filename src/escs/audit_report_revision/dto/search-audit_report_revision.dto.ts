import { PartialType } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateAuditReportRevisionDto } from './create-audit_report_revision.dto';
import { Type } from 'class-transformer';

export class SearchAuditReportRevisionDto extends PartialType(
    CreateAuditReportRevisionDto,
) {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    ARR_REV?: number;

    @IsOptional()
    @IsString()
    ARR_REV_TEXT?: string;

    @IsOptional()
    @IsString()
    @IsIn(['ASC', 'DESC'])
    readonly orderbyDirection?: 'ASC' | 'DESC';
}
