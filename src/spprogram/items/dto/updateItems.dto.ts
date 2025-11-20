import { PartialType } from '@nestjs/mapped-types';
import { createItemsDto } from './createItems.dto';
export class updateItemsDto extends PartialType(createItemsDto) {}
