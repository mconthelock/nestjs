import { PartialType } from '@nestjs/swagger';
import { CreateEbgreqcolImageDto } from './create-ebgreqcol-image.dto';
import { IsArray, IsNotEmpty } from 'class-validator';

export class SearchEbgreqcolImageDto extends PartialType(CreateEbgreqcolImageDto) {
}
