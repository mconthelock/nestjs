import { PartialType } from '@nestjs/swagger';
import { CreateQuotationTypeDto } from './create-quotation-type.dto';

export class UpdateQuotationTypeDto extends PartialType(CreateQuotationTypeDto) {}
