import { PartialType } from '@nestjs/swagger';
import { CreateOrdermainDto } from './create-ordermain.dto';

export class UpdateOrdermainDto extends PartialType(CreateOrdermainDto) {}
