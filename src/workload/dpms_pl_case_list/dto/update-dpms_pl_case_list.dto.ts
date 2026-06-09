import { PartialType } from '@nestjs/swagger';
import { CreateDpmsPlCaseListDto } from './create-dpms_pl_case_list.dto';

export class UpdateDpmsPlCaseListDto extends PartialType(CreateDpmsPlCaseListDto) {}
