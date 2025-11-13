import { Controller, Param, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ItemarrnglstService } from './itemarrnglst.service';
import { AuthGuard } from '@nestjs/passport';

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

  @Post('search')
  @UseGuards(AuthGuard('jwt'))
  async search(@Body() body: any) {
    const data = await this.items.search(body.ordno, body.item);
    return data;
  }
}
