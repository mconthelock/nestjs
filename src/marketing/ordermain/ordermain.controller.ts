import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdermainService } from './ordermain.service';
import { CreateOrdermainDto } from './dto/create-ordermain.dto';
import { UpdateOrdermainDto } from './dto/update-ordermain.dto';
import { SearchOrdermainDto } from './dto/search-ordermain.dto';

@Controller('mkt/orders')
export class OrdermainController {
  constructor(private readonly ords: OrdermainService) {}

  @Post('search')
  search(@Body() req: SearchOrdermainDto) {
    return this.ords.search(req);
  }
}
