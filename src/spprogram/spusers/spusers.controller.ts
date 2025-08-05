import { Controller } from '@nestjs/common';
import { SpusersService } from './spusers.service';

@Controller('spusers')
export class SpusersController {
  constructor(private readonly spusersService: SpusersService) {}
}
