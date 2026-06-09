import { PartialType } from '@nestjs/swagger';
import { CreateDpmsPlCaseListDetailDto } from './create-dpms_pl_case_list_detail.dto';

export class UpdateDpmsPlCaseListDetailDto extends PartialType(CreateDpmsPlCaseListDetailDto) {}
