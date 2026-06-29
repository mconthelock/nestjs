import { PartialType } from '@nestjs/swagger';
import { CreateFinpckVwdetailDto } from './create-finpck-vwdetail.dto';

export class UpdateFinpckVwdetailDto extends PartialType(CreateFinpckVwdetailDto) {}
