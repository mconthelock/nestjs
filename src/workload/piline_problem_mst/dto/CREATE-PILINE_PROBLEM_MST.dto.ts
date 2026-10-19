import {
    IsInt,
    Min,
    Max,
    IsString,
    MaxLength,
    Matches,
    ValidateIf,
} from 'class-validator';

export class CreatePilineProblemMstDto {
    @IsInt()
    @Min(Number.MIN_SAFE_INTEGER)
    @Max(Number.MAX_SAFE_INTEGER)
    PROBLEM_ID: number;

    @IsString()
    @MaxLength(200)
    @Matches(/\S/, { message: '$property must not be blank' })
    PROBLEM_NAME: string;

    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(1)
    @Matches(/\S/, { message: '$property must not be blank' })
    STATUS?: string;
}
