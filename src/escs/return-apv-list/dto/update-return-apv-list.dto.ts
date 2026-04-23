import { PartialType } from '@nestjs/swagger';
import { CreateReturnApvListDto } from './create-return-apv-list.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class UpdateReturnApvListDto extends PartialType(
    CreateReturnApvListDto,
) {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NID: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NUSERUPDATE: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NSTATUS: number;
}

export class ActionReturnApvListDto {
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpdateReturnApvListDto)
    LIST: UpdateReturnApvListDto[];

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NSTATUS: number;
}
