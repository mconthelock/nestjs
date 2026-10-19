import { ValidateIf, IsString, MaxLength, Matches } from 'class-validator';

export class UpdatePilineEventMstDto {
    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(100)
    @Matches(/\S/, { message: '$property must not be blank' })
    MAIN_CATEGORY?: string;

    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(100)
    @Matches(/\S/, { message: '$property must not be blank' })
    EVENT_TYPE?: string;

    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(100)
    @Matches(/\S/, { message: '$property must not be blank' })
    PRODUCTION_IMPACT?: string;

    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(1)
    @Matches(/\S/, { message: '$property must not be blank' })
    STATUS?: string;
}
