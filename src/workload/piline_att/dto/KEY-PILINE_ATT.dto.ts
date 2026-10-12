import { Transform } from 'class-transformer';
import { IsString, MaxLength, Matches, IsInt, Min, Max } from 'class-validator';

export class KeyPilineAttDto {
    @IsString()
    @MaxLength(11)
    @Matches(/\S/, { message: '$property must not be blank' })
    PILINE_NO: string;

    @IsInt()
    @Min(-99)
    @Max(99)
    @Transform(({ value }) =>
        typeof value === 'string' && /^-?\d+$/.test(value)
            ? Number(value)
            : value,
    )
    SEQ: number;

    @IsString()
    @MaxLength(4)
    @Matches(/\S/, { message: '$property must not be blank' })
    TYPEFILE: string;
}
