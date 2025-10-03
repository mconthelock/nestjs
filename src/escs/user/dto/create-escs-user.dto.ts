import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEscsUserDto {
  @ApiProperty({ example: '24008' })
  @IsNotEmpty()
  @IsString()
  USR_NO?: string;

  @ApiProperty({ example: 'SUTTHIPONG TANGMONKHONCHAROEN' })
  @IsNotEmpty()
  @IsString()
  USR_NAME?: string;

  @ApiProperty({
    required: false,
    example: 'sutthipongt@MitsubishiElevatorAsia.co.th',
  })
  @IsNotEmpty()
  @IsString()
  USR_EMAIL?: string;

  @ApiProperty({ required: false, example: 4, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  USR_USERUPDATE?: number = 0;

  @ApiProperty({ example: 4 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  GRP_ID?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  SEC_ID?: number;
}
