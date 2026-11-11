import { PartialType } from '@nestjs/swagger';
import { CreateReportProdDto } from './create-report_prod.dto';

export class UpdateReportProdDto extends PartialType(CreateReportProdDto) {}
