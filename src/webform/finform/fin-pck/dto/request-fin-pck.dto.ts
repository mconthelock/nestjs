import { IntersectionType, OmitType,PartialType, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNotEmptyObject,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
    ArrayMinSize,
    Validate
} from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { CreateFinpckAssetDto } from '../finpck_asset/dto/create-finpck_asset.dto';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';

export class AssetItemInputDto extends OmitType(CreateFinpckAssetDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
  'ID', // ตัด ID ทิ้งด้วยเพราะเดี๋ยว Service เราจะเป็นคน Running เลขให้เองค่ะ
] as const) {}

export class GroupedDataInputDto {
  @IsNotEmpty()
  @IsString()
  CCCODE: string;

  @IsNotEmpty()
  @IsString()
  CCDESC: string;

  @IsNotEmpty()
  @IsString()
  LOCCODE: string;

  @IsNotEmpty()
  @IsString()
  LOCNAME: string;

  @IsOptional()
  @IsString()
  INC?: string;

  @IsOptional()
  @IsString()
  SPOSCODE?: string;

  
  @IsOptional()
  @IsString()
  INCVORGNO?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssetItemInputDto) // โยงไปหา DTO ข้อ 1
  ASSETS: AssetItemInputDto[]; 
}

export class RequestFinpckFormDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateFormDto)
  formData: CreateFormDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupedDataInputDto) // โยงไปหา DTO ข้อ 2
  groupedData: GroupedDataInputDto[]; 

}

