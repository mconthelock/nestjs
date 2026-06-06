import { Controller } from '@nestjs/common';
import { DpmsPlFileService } from './dpms_pl_file.service';

@Controller('dpms-pl-file')
export class DpmsPlFileController {
    constructor(private readonly service: DpmsPlFileService) {}
}
