import { PartialType } from '@nestjs/swagger';
import { CreateBlockMasterDto } from './create-block-master.dto';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBlockMasterDto extends PartialType(CreateBlockMasterDto) {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NSTATUS?: number;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    DDATEUPDATE?: Date;
}

export class SearchBlockMasterDto extends PartialType(CreateBlockMasterDto) {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NID?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NSTATUS?: number;
}
