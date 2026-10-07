import { IsDefined, IsString, Matches } from 'class-validator';

export class AutoInspectionDto {
    @IsDefined()
    @IsString()
    @Matches(/^\d{2}\/\d{2}\/\d{4}$/)
    date: string;
}
