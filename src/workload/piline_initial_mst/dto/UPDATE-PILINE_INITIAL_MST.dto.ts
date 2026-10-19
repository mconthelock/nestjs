import { ValidateIf, IsString, MaxLength, Matches } from 'class-validator';

export class UpdatePilineInitialMstDto {
    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(300)
    @Matches(/\S/, { message: '$property must not be blank' })
    INITIAL_DETAIL?: string;

    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(1)
    @Matches(/\S/, { message: '$property must not be blank' })
    STATUS?: string;
}
