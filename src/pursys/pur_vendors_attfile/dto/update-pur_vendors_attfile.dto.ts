import { PartialType } from '@nestjs/swagger';
import { CreatePurVendorsAttfileDto } from './create-pur_vendors_attfile.dto';

export class UpdatePurVendorsAttfileDto extends PartialType(CreatePurVendorsAttfileDto) {}
