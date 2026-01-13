import { PartialType } from '@nestjs/swagger';
import { CreateEbudgetQuotationProductDto } from './create-ebudget-quotation-product.dto';

export class UpdateEbudgetQuotationProductDto extends PartialType(CreateEbudgetQuotationProductDto) {}
