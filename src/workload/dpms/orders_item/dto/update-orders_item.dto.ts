import { PartialType } from '@nestjs/swagger';
import { CreateOrdersItemDto } from './create-orders_item.dto';

export class UpdateOrdersItemDto extends PartialType(CreateOrdersItemDto) {}
