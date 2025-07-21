import { Controller } from '@nestjs/common';
import { AftsysdocService } from './aftsysdoc.service';

@Controller('aftsysdoc')
export class AftsysdocController {
  constructor(private readonly aftsysdocService: AftsysdocService) {}
}
