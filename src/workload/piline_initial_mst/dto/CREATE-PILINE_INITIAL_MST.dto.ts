import {
    IsInt,
    Min,
    Max,
    IsString,
    MaxLength,
    Matches,
    ValidateIf,
} from 'class-validator';

export class CreatePilineInitialMstDto {
    @IsInt()
    @Min(Number.MIN_SAFE_INTEGER)
    @Max(Number.MAX_SAFE_INTEGER)
    INITIAL_ID: number;

    @IsString()
    @MaxLength(300)
    @Matches(/\S/, { message: '$property must not be blank' })
    INITIAL_DETAIL: string;

    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(1)
    @Matches(/\S/, { message: '$property must not be blank' })
    STATUS?: string;
}
