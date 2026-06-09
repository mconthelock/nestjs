import { Controller } from '@nestjs/common';
import { DpmsPlCaseListDetailService } from './dpms_pl_case_list_detail.service';
@Controller('dpms-pl-case-list-detail')
export class DpmsPlCaseListDetailController {
    constructor(private readonly service: DpmsPlCaseListDetailService) {}
}
