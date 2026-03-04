import { PartialType } from '@nestjs/swagger';
import { CreatePproductDto } from './create-pproduct.dto';

export class UpdatePproductDto extends PartialType(CreatePproductDto) {}
