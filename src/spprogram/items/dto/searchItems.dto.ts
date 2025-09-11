import { PartialType } from '@nestjs/mapped-types';
import { createItemsDto } from './createItems.dto';
export class searchItemsDto extends PartialType(createItemsDto) {}
