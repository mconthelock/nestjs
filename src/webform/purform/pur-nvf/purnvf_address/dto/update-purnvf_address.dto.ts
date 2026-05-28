import { PartialType } from '@nestjs/swagger';
import { CreatePurnvfAddressDto } from './create-purnvf_address.dto';

export class UpdatePurnvfAddressDto extends PartialType(CreatePurnvfAddressDto) {}
