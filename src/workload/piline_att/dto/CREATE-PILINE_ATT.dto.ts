import { IsString, MaxLength, Matches, IsInt, Min, Max } from 'class-validator';

export class CreatePilineAttDto {
    @IsString()
    @MaxLength(11)
    @Matches(/\S/, { message: '$property must not be blank' })
    PILINE_NO: string;

    @IsInt()
    @Min(-99)
    @Max(99)
    SEQ: number;

    @IsString()
    @MaxLength(300)
    @Matches(/\S/, { message: '$property must not be blank' })
    FILENAME: string;

    @IsString()
    @MaxLength(4)
    @Matches(/\S/, { message: '$property must not be blank' })
    TYPEFILE: string;
}
