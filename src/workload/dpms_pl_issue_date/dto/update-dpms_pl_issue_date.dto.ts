import { PartialType } from '@nestjs/swagger';
import { CreateDpmsPlIssueDateDto } from './create-dpms_pl_issue_date.dto';

export class UpdateDpmsPlIssueDateDto extends PartialType(CreateDpmsPlIssueDateDto) {}
