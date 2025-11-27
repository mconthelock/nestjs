import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class PackUserInfoDto {
  @ApiProperty({ 
    description: 'User ID', 
    example: 'USR01' 
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ 
    description: 'User Name', 
    example: 'Mr. Pathanapong' 
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ 
    description: '0 = AS400 data, 1 = Local data',
    enum: ['0', '1'], 
  })
  @IsEnum(['0', '1'])
  useLocaltb: string;

  @ApiProperty({ 
    description: 'Session ID', 
    example: 'abc123xyz' 
  })
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
