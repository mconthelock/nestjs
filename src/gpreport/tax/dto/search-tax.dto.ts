import { PartialType } from '@nestjs/swagger';
import { CreateTaxDto } from './create-tax.dto';

export class SearchTaxDto extends PartialType(CreateTaxDto) {}
