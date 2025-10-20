import { Controller } from '@nestjs/common';
import { MasterkeyService } from './masterkey.service';

@Controller('masterkey')
export class MasterkeyController {
  constructor(private readonly masterkeyService: MasterkeyService) {}
}
