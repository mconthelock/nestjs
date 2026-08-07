import { PartialType } from '@nestjs/swagger';
import { CreateOrdersItemDto } from './create-orders_item.dto';

export class SearchOrdersItemDto extends PartialType(CreateOrdersItemDto) {}
