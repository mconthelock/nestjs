import { Controller } from '@nestjs/common';
import { IeFileService } from './ie-file.service';

@Controller('ie-file')
export class IeFileController {
    constructor(private readonly ieFileService: IeFileService) {}
}
