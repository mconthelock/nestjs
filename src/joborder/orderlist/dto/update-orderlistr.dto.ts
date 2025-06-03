import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderListDto } from './create-orderlist.dto';

export class UpdateOrderListDto extends PartialType(CreateOrderListDto) {}
