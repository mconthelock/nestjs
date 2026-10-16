import { IsString, MaxLength, Matches } from 'class-validator';

export class CreatePilineSectionMstDto {
    @IsString()
    @MaxLength(6)
    @Matches(/\S/, { message: '$property must not be blank' })
    SSECCODE: string;
}
