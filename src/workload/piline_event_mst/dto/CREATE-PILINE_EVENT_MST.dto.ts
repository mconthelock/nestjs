import {
    IsInt,
    Min,
    Max,
    IsString,
    MaxLength,
    Matches,
    ValidateIf,
} from 'class-validator';

export class CreatePilineEventMstDto {
    @IsInt()
    @Min(Number.MIN_SAFE_INTEGER)
    @Max(Number.MAX_SAFE_INTEGER)
    EVENT_ID: number;

    @IsString()
    @MaxLength(100)
    @Matches(/\S/, { message: '$property must not be blank' })
    MAIN_CATEGORY: string;

    @IsString()
    @MaxLength(100)
    @Matches(/\S/, { message: '$property must not be blank' })
    EVENT_TYPE: string;

    @IsString()
    @MaxLength(100)
    @Matches(/\S/, { message: '$property must not be blank' })
    PRODUCTION_IMPACT: string;

    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(1)
    @Matches(/\S/, { message: '$property must not be blank' })
    STATUS?: string;
}
