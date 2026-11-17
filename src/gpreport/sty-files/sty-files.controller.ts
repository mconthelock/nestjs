import { Controller } from '@nestjs/common';
import { StyFilesService } from './sty-files.service';

@Controller('sty-files')
export class StyFilesController {
  constructor(private readonly styFilesService: StyFilesService) {}
}
