import {
    ValidateIf,
    IsString,
    MaxLength,
    Matches,
    IsInt,
    Min,
    Max,
    IsOptional,
} from 'class-validator';

export class UpdatePilineNgRecordDto {
    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(20)
    @Matches(/\S/, { message: '$property must not be blank' })
    ID_TAG?: string;

    @ValidateIf((_, value) => value !== undefined)
    @IsInt()
    @Min(-999)
    @Max(999)
    QTY?: number;

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
