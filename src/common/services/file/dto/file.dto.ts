import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum ListMode {
  ALL = 'all',
  FILE = 'file',
  DIR = 'dir',
}

export class FileDto {
  @IsNotEmpty()
  @IsString()
  baseDir: string; // FILE_PATH

  @IsNotEmpty()
  @IsString()
  storedName: string; // FILE_FNAME (ชื่อที่เก็บจริง)

  @IsOptional()
  @IsString()
  originalName?: string; // FILE_ONAME (ถ้ามีจะใช้ตั้งชื่อเวลา download/open)

  @IsNotEmpty()
  @IsString()
  @IsIn(['open', 'download'])
  mode: string; // โหมดเปิดไฟล์หรือดาวน์โหลด
}

export class ListDto {
  @IsNotEmpty()
  @IsString()
  baseDir: string;

  @IsOptional()
  @IsString()
  path: string;

  @IsOptional()
  @IsString({ each: true })
  allow?: string[];

  @IsOptional()
  @IsEnum(ListMode)
  mode?: ListMode; // all | file | dir
}

export class SaveFileDto {
  @IsNotEmpty()
  @IsString()
  path: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPhp: boolean;
}
