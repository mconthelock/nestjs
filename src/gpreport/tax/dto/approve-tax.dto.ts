import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ApproveTaxDto {
    @IsNotEmpty()
    @IsString()
    year: string; // CYEAR2 เช่น '2026'

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    runno: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    action: number; // 2: อนุมัติ (Approve), 3: ส่งกลับแก้ไข (Reject)

    @IsOptional()
    @IsString()
    remark?: string;

    @IsOptional()
    @IsString()
    approverEmpno?: string;
}
