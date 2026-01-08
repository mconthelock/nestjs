import { Controller, Post, Body } from '@nestjs/common';
import { OrderpartsService } from './orderparts.service';
import { SearchOrderpartDto } from './dto/search-orderpart.dto';

@Controller('mkt/part')
export class OrderpartsController {
  constructor(private readonly ords: OrderpartsService) {}

  @Post('search')
  search(@Body() req: SearchOrderpartDto) {
    return this.ords.search(req);
  }

  @Post('sp-orders')
  searchSP(@Body() req: SearchOrderpartDto) {
    return this.ords.searchSP(req);
  }
}
