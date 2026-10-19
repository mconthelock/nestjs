import { ValidateIf, IsString, MaxLength, Matches } from 'class-validator';

export class UpdatePilineAttDto {
    @ValidateIf((_, value) => value !== undefined)
    @IsString()
    @MaxLength(300)
    @Matches(/\S/, { message: '$property must not be blank' })
    FILENAME?: string;
}
