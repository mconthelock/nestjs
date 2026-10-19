import { ValidateIf, IsString, MaxLength, Matches } from 'class-validator';

export class UpdatePilineCauseMstDto {
    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(300)
    @Matches(/\S/, { message: '$property must not be blank' })
    CAUSE_NAME?: string;

    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(1)
    @Matches(/\S/, { message: '$property must not be blank' })
    STATUS?: string;
}
