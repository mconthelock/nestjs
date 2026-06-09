import { Controller } from '@nestjs/common';
import { DpmsPlCaseListService } from './dpms_pl_case_list.service';

@Controller('dpms-pl-case-list')
export class DpmsPlCaseListController {
    constructor(private readonly service: DpmsPlCaseListService) {}
}
