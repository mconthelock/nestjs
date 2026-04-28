import { PartialType } from '@nestjs/swagger';
import { CreateGetOrderDto } from './create-get-order.dto';

export class UpdateGetOrderDto extends PartialType(CreateGetOrderDto) {}
