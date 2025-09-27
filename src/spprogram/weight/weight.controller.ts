import { Controller } from '@nestjs/common';
import { WeightService } from './weight.service';

@Controller('weight')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}
}
