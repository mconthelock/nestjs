import {
    IsInt,
    Min,
    Max,
    IsString,
    MaxLength,
    Matches,
    ValidateIf,
} from 'class-validator';

export class CreatePilineLocationMstDto {
    @IsInt()
    @Min(Number.MIN_SAFE_INTEGER)
    @Max(Number.MAX_SAFE_INTEGER)
    LOCATION_ID: number;

    @IsString()
    @MaxLength(100)
    @Matches(/\S/, { message: '$property must not be blank' })
    LOCATION_NAME: string;

    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(1)
    @Matches(/\S/, { message: '$property must not be blank' })
    STATUS?: string;
}
