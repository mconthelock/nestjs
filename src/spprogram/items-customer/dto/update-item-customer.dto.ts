import { PartialType } from '@nestjs/mapped-types';
import { createItemCustomerDto } from './create-item-customer.dto';
export class updateItemCustomerDto extends PartialType(createItemCustomerDto) {}
