import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { CreateDataAreaDto } from './create-data-area.dto';

export class UpdateAreaDto extends PartialType(CreateDataAreaDto) {
    @IsOptional()
    @IsString()
    @IsIn(['0', '1'])
    AREA_STATUS?: string;
}