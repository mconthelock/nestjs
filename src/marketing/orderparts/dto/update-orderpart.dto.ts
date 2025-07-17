import { PartialType } from '@nestjs/swagger';
import { CreateOrderpartDto } from './create-orderpart.dto';

export class UpdateOrderpartDto extends PartialType(CreateOrderpartDto) {}
