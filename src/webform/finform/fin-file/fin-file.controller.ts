import { Controller } from '@nestjs/common';
import { FinFileService } from './fin-file.service';

@Controller('fin-file')
export class FinFileController {
    constructor(private readonly finFileService: FinFileService) {}
}
