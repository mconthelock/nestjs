import { IsOptional, IsString, MaxLength } from 'class-validator';
export class FinishInspectionDto {
    @IsOptional()
    @IsString()
    @MaxLength(10)
    UPDATE_BY?: string;
}
