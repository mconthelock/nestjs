import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateReportPermissionDto {
    @IsString()
    @IsNotEmpty()
    USERS: string;

    @IsString()
    @IsNotEmpty()
    REPORTTYPE: string;

    @IsString()
    @IsOptional()
    SECTION: string;

    @IsString()
    @IsOptional()
    DEPARTMENT: string;

    @IsString()
    @IsOptional()
    DIVISION: string;

    @IsString()
    @IsOptional()
    SUPPER: string;
}
