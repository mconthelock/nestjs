import { Controller } from '@nestjs/common';
import { GpFileService } from './gp-file.service';

@Controller('gp-file')
export class GpFileController {
    constructor(private readonly gpFileService: GpFileService) {}
}
