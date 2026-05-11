import { Controller } from '@nestjs/common';
import { PsFileService } from './ps-file.service';

@Controller('ps-file')
export class PsFileController {
    constructor(private readonly psFileService: PsFileService) {}
}
