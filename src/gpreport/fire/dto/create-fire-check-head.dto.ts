import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { FireCheckHeadKeyDto } from './fire-check-key.dto';

export class CreateFireCheckHeadDto extends FireCheckHeadKeyDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, { message: 'AREA must contain non-whitespace characters' })
    @MaxLength(100)
    AREA: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, { message: 'FMONTH must contain non-whitespace characters' })
    @MaxLength(2)
    FMONTH: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, { message: 'FYEAR must contain non-whitespace characters' })
    @MaxLength(4)
    FYEAR: string;
}
