import { PartialType } from '@nestjs/swagger';
import { CreateOrderdummyDto } from './create-orderdummy.dto';

export class UpdateOrderdummyDto extends PartialType(CreateOrderdummyDto) {}
