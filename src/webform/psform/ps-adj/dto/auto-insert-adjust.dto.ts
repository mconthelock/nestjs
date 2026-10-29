import { OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { CreateOrderDto } from './ps-adj.dto';

export class AutoInsertAdjustDto extends OmitType(CreateOrderDto, ['CYEAR2', 'NRUNNO'] as const) {
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, { message: 'REQBY must not be blank' })
    @MaxLength(10)
    REQBY: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, { message: 'INPUTBY must not be blank' })
    @MaxLength(10)
    INPUTBY: string;
}
