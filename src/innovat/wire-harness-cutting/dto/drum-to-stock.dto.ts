import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DrumToStockDto {
    @ApiProperty({
        example: '15234',
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
        example: '2026091',
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
<<<<<<< HEAD:src/innovat/wire-harness-cutting/dto/drum-to-stock.dto.ts
<<<<<<<< HEAD:src/innovat/wire-harness-cutting/dto/drum-to-stock.dto.ts
    drumId: number;
========
    cut: number;

    @ApiProperty({
        example: 1,
        description: 'Cut type (1 = First Cut, 2 = Re-Cut)',
    })
    @IsNumber()
    cutType: number;
>>>>>>>> 9119de43 (wire-harness):src/innovat/wire-harness/dto/create-drum.dto.ts
=======
    drumId: number;
>>>>>>> 9119de43 (wire-harness):src/innovat/wire-harness/dto/drum-to-stock.dto.ts
}