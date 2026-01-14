import { PartialType } from '@nestjs/swagger';
import { CreateEbudgetQuotationDto } from './create-ebudget-quotation.dto';

export class UpdateEbudgetQuotationDto extends PartialType(CreateEbudgetQuotationDto) {}
