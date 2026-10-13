import {
    IsString,
    MaxLength,
    Matches,
    IsInt,
    Min,
    Max,
    IsOptional,
} from 'class-validator';

export class CreatePilineNgRecordDto {
    @IsString()
    @MaxLength(11)
    @Matches(/\S/, { message: '$property must not be blank' })
    PILINE_NO: string;

    @IsString()
    @MaxLength(20)
    @Matches(/\S/, { message: '$property must not be blank' })
    ID_TAG: string;

    @IsInt()
    @Min(-999)
    @Max(999)
    QTY: number;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    MAT_LOT?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    MAT_NO?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    REMARK_NG?: string | null;
}
