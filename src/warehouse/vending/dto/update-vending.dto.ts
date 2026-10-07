import { PartialType } from '@nestjs/swagger';
import { CreateVendingDto } from './create-vending.dto';

export class UpdateVendingDto extends PartialType(CreateVendingDto) {}
