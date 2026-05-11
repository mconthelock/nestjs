import { Controller } from '@nestjs/common';
import { FeFileService } from './fe-file.service';

@Controller('fe-file')
export class FeFileController {
    constructor(private readonly feFileService: FeFileService) {}
}
