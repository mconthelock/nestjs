import { PartialType } from '@nestjs/swagger';
import { CreateBlockPackingDto } from './create-block_packing.dto';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class UpdateBlockPackingDto extends PartialType(CreateBlockPackingDto) {
    @IsString()
    ORDERNO: string;

    @IsString()
    PACKNO: string;

    @IsString()
    REMARK: string;
}

export class UpdateRemarkByOrderDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    ORDERSNO: string[];

    @IsString()
    REMARK: string;
}
