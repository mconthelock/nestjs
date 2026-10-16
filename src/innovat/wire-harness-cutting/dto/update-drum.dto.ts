import { ApiProperty } from '@nestjs/swagger';
<<<<<<< HEAD:src/innovat/wire-harness-cutting/dto/update-drum.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
=======
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
>>>>>>> 9119de43 (wire-harness):src/innovat/wire-harness/dto/update-drum.dto.ts

export class UpdateDrumDto {
    @ApiProperty({
        example: '99999',
        description: 'Employee number',
    })
    @IsString()
    @IsNotEmpty()
    empNo: string;

    @ApiProperty({
        example: 'F9999',
        description: 'Item code',
    })
    @IsString()
    @IsNotEmpty()
    itemCode: string;

    @ApiProperty({
        example: '2026081',
        description: 'Production number',
    })
    @IsString()
    @IsNotEmpty()
    prodNo: string;

    @ApiProperty({
        example: 1,
        description: 'Drum ID',
    })
    @IsNumber()
    drumId: number;

    @ApiProperty({
        example: 'C6071300JC4',
        description: 'Control number',
    })
    @IsString()
    @IsNotEmpty()
    ctrlNo: string;

    @ApiProperty({
        example: 100.9,
        description: 'Cut length',
    })
    @IsNumber()
    cut: number;

    @ApiProperty({
        example: 1,
<<<<<<< HEAD:src/innovat/wire-harness-cutting/dto/update-drum.dto.ts
        description: 'Cut type (1 = First Cut, 2 = Rework)',
    })
    @IsNumber()
    cutType: number;

    @ApiProperty({
        example: 99,
        description: 'Reason ID',
        required: false,
        nullable: true,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    reasonId: number | null;
=======
        description: 'Cut type (1 = First Cut, 2 = Re-Cut)',
    })
    @IsNumber()
    cutType: number;
>>>>>>> 9119de43 (wire-harness):src/innovat/wire-harness/dto/update-drum.dto.ts
}