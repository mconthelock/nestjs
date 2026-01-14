import { Controller } from '@nestjs/common';
import { SpcalsheetService } from './spcalsheet.service';

@Controller('spcalsheet')
export class SpcalsheetController {
  constructor(private readonly spcalsheetService: SpcalsheetService) {}
}
