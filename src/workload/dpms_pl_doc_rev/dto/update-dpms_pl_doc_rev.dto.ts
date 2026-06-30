import { PartialType } from '@nestjs/swagger';
import { CreateDpmsPlDocRevDto } from './create-dpms_pl_doc_rev.dto';

export class UpdateDpmsPlDocRevDto extends PartialType(CreateDpmsPlDocRevDto) {}
