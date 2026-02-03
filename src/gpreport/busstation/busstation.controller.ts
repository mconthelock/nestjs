import { Controller } from '@nestjs/common';
import { BusstationService } from './busstation.service';

@Controller('busstation')
export class BusstationController {
  constructor(private readonly busstationService: BusstationService) {}
}
