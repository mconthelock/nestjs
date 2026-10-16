import { ValidateIf, IsString, MaxLength, Matches } from 'class-validator';

export class UpdatePilineLocationMstDto {
    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(100)
    @Matches(/\S/, { message: '$property must not be blank' })
    LOCATION_NAME?: string;

    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(1)
    @Matches(/\S/, { message: '$property must not be blank' })
    STATUS?: string;
}
