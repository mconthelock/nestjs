import { Controller } from '@nestjs/common';
import { MarFileService } from './mar-file.service';

@Controller('mar-file')
export class MarFileController {
    constructor(private readonly marFileService: MarFileService) {}
}
