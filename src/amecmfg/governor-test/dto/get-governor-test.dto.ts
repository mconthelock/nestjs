import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetGovernorTestDto {
    @ApiProperty({ 
        description: 'Order number',
        examples: {
            normal: {
                value: 'E8CB37524',
                summary: 'Normal order'
            },
            withSuffix: {
                value: 'ET4257021_20',
                summary: 'Order with suffix'
            }
        }
    })
    @IsString()
    @IsNotEmpty()
    order: string;

    @ApiProperty({ 
        description: 'Machine name',
        examples: {
            gov48: {
                value: 'QA_GOVERNER48_D'
            },
            gov54: {
                value: 'QA_GOVERNER48_DX'
            }
        }
    })
    @IsString()
    @IsNotEmpty()
    machineName: string;
}