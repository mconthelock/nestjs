import {
    ValidateIf,
    IsInt,
    Min,
    Max,
    IsString,
    MaxLength,
    Matches,
} from 'class-validator';

export class UpdatePilineMappingMstDto {
    @ValidateIf((_, value) => value !== undefined)
    @IsInt()
    @Min(Number.MIN_SAFE_INTEGER)
    @Max(Number.MAX_SAFE_INTEGER)
    LOCATION_ID?: number;

    @ValidateIf((_, value) => value !== undefined)
    @IsInt()
    @Min(Number.MIN_SAFE_INTEGER)
    @Max(Number.MAX_SAFE_INTEGER)
    CAUSE_ID?: number;

    @ValidateIf((_, value) => value !== undefined)
    @IsInt()
    @Min(Number.MIN_SAFE_INTEGER)
    @Max(Number.MAX_SAFE_INTEGER)
    PROBLEM_ID?: number;

    @ValidateIf((_, value) => value !== undefined)
    @IsInt()
    @Min(Number.MIN_SAFE_INTEGER)
    @Max(Number.MAX_SAFE_INTEGER)
    EVENT_ID?: number;

    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(1)
    @Matches(/\S/, { message: '$property must not be blank' })
    STATUS?: string;
}
