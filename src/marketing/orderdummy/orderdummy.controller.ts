import { Controller, Post, Body } from '@nestjs/common';
import { OrderdummyService } from './orderdummy.service';
import { SearchOrderdummyDto } from './dto/search-orderdummy.dto';

@Controller('mkt/dummy')
export class OrderdummyController {
  constructor(private readonly ords: OrderdummyService) {}

  @Post('search')
  search(@Body() req: SearchOrderdummyDto) {
    return this.ords.search(req);
  }
}
