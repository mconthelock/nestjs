import { Controller } from '@nestjs/common';
import { PricelistService } from './pricelist.service';

@Controller('pricelist')
export class PricelistController {
  constructor(private readonly pricelistService: PricelistService) {}
}
