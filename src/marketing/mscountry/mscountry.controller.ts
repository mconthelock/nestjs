import { Controller, Get } from '@nestjs/common';
import { MscountryService } from './mscountry.service';

@Controller('mkt/country')
export class MscountryController {
  constructor(private readonly country: MscountryService) {}

  @Get()
  findAll() {
    return this.country.findAll();
  }
}
