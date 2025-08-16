import { Controller, Post, Body } from '@nestjs/common';
import { OrdermainService } from './ordermain.service';
import { SearchOrdermainDto } from './dto/search-ordermain.dto';

@Controller('mkt/orders')
export class OrdermainController {
  constructor(private readonly ords: OrdermainService) {}

  @Post('search')
  search(@Body() req: SearchOrdermainDto) {
    return this.ords.search(req);
  }
  @Post('sproj')
  sproj(@Body() req: SearchOrdermainDto) {
    return this.ords.sproj(req);
  }
}
