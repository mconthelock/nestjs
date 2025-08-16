import { Controller, Param, Get, Post, Body } from '@nestjs/common';
import { ItemarrnglstService } from './itemarrnglst.service';

@Controller('elmes/gplitem')
export class ItemarrnglstController {
  constructor(private readonly items: ItemarrnglstService) {}

  @Get('item/:ordno/:item')
  async findOrders(@Param('ordno') ordno: string, @Param('item') item: string) {
    return await this.items.findOrders(ordno, item);
  }

  @Post('drawing')
  async findDrawing(@Body() body: any) {
    const data = await this.items.findOrders(body.ordno, body.item);
    const dwgs = data.filter((dwg) => dwg.drawing == body.dwg);
    return dwgs;
  }
}
