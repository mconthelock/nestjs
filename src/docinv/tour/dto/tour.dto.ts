import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TourMasterDto {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    KEY: string;
}

export class TourUserDto extends PickType(TourMasterDto, ['KEY'] as const) {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    EMPNO: string;
}

export class CreateTourUserDto extends PickType(TourUserDto, [
    'KEY',
    'EMPNO',
] as const) {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    VERSION: number;
}
