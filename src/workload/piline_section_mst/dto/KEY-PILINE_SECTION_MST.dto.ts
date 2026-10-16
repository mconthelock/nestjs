import { IsString, MaxLength, Matches } from 'class-validator';

export class KeyPilineSectionMstDto {
    @IsString()
    @MaxLength(6)
    @Matches(/\S/, { message: '$property must not be blank' })
    SSECCODE: string;
}
