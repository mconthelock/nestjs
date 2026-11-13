import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

export class FireCheckHeadKeyDto {
    @Transform(({ value }) => typeof value === 'string' && /^-?\d+$/.test(value) ? Number(value) : value)
    @IsInt()
    @Min(-999)
    @Max(999)
    NFRMNO: number;

    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, { message: 'VORGNO must contain non-whitespace characters' })
    @MaxLength(6)
    VORGNO: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, { message: 'CYEAR must contain non-whitespace characters' })
    @MaxLength(2)
    CYEAR: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, { message: 'CYEAR2 must contain non-whitespace characters' })
    @MaxLength(4)
    CYEAR2: string;

    @Transform(({ value }) => typeof value === 'string' && /^-?\d+$/.test(value) ? Number(value) : value)
    @IsInt()
    @Min(-999999)
    @Max(999999)
    NRUNNO: number;
}

export class FireCheckDetailKeyDto extends FireCheckHeadKeyDto {
    @Transform(({ value }) => typeof value === 'string' && /^-?\d+$/.test(value) ? Number(value) : value)
    @IsInt()
    @Min(-999)
    @Max(999)
    ID: number;

    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, { message: 'FIRE_CODE must contain non-whitespace characters' })
    @MaxLength(20)
    FIRE_CODE: string;
}
