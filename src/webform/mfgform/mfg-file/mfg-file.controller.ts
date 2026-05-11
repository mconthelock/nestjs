import { Controller } from '@nestjs/common';
import { MfgFileService } from './mfg-file.service';

@Controller('mfg-file')
export class MfgFileController {
    constructor(private readonly mfgFileService: MfgFileService) {}
}
