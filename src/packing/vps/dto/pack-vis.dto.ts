import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';

export enum UseLocalTableFlag {
  AS400 = '0',
  LOCAL = '1',
}

export class PackVISDto {
    @ApiProperty({ 
        description: 'VIS Code',
        examples: {
            sample1: { value: '07C118A95807' },
            sample2: { value: '07C1108A95807' },
        },
    })
    @IsString() 
    @IsNotEmpty()
    vis: string;

    @ApiProperty({ example: '15234' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        description: '0 = AS400 data, 1 = Local data',
        enum: UseLocalTableFlag,
    })
    @IsEnum(UseLocalTableFlag)
    useLocaltb: UseLocalTableFlag;
}
