import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchEscsUserDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly USR_ID?: number;

  @ApiProperty({ required: false, example: '15234' })
  @IsOptional()
  @IsString()
  readonly USR_NO?: string;

  @ApiProperty({ required: false, example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly GRP_ID?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly USR_STATUS?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly SEC_ID?: number;

  
//   @ApiProperty({ example: ['USR_ID', 'USR_NO', 'USR_NAME', 'USR_EMAIL', 'USR_REGISTDATE', 'USR_USERUPDATE', 'USR_DATEUPDATE', 'GRP_ID', 'USR_STATUS', 'SEC_ID', "SEMPNO", "PSNIDN" , "SEMPPRE", "SNAME", "SEMPPRT", "BIRTHDAY", "STNAME", "SSEC", "SDEPT", "SDIV", "SRECMAIL", "MEMEML", "SPOSITION", "SPOSNAME", "STARTDATE", "SSECCODE", "SDEPCODE", "SDIVCODE", "SPOSCODE", "CLEVEL", "CSTATUS", "JOBTYPE", "EMPSEX"] })
  @ApiProperty({ required: false, example: ['USR_ID', 'USR_NO', 'USR_NAME', 'USR_EMAIL', 'USR_REGISTDATE', 'USR_USERUPDATE', 'USR_DATEUPDATE', 'GRP_ID', 'USR_STATUS', 'SEC_ID', "SEMPNO", "SNAME", "STNAME", "SSEC", "SDEPT", "SDIV", "SRECMAIL", "MEMEML", "SPOSNAME","SSECCODE", "SDEPCODE", "SDIVCODE", "SPOSCODE",  "CSTATUS"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];
}
