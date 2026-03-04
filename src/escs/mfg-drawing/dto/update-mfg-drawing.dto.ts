import { PartialType } from '@nestjs/swagger';
import { CreateMfgDrawingDto } from './create-mfg-drawing.dto';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMfgDrawingDto extends PartialType(CreateMfgDrawingDto) {}
