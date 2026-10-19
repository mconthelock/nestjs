import { IsString, MaxLength, Matches } from 'class-validator';

export class KeyPilineNgRecordDto {
    @IsString()
    @MaxLength(11)
    @Matches(/\S/, { message: '$property must not be blank' })
    PILINE_NO: string;
}
