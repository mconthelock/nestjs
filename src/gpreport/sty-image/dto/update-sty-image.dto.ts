import { PartialType } from '@nestjs/swagger';
import { CreateStyImageDto } from './create-sty-image.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateStyImageDto extends PartialType(CreateStyImageDto) {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    IMAGE_ID: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    IMAGE_USERUPDATE: string;
}
