import { ValidateIf, IsString, MaxLength, Matches } from 'class-validator';

export class UpdatePilineProblemMstDto {
    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(200)
    @Matches(/\S/, { message: '$property must not be blank' })
    PROBLEM_NAME?: string;

    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(1)
    @Matches(/\S/, { message: '$property must not be blank' })
    STATUS?: string;
}
