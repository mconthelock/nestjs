import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GeneralPartListService } from './general-part-list.service';

@Controller('general-part-list')
export class GeneralPartListController {
  constructor(private readonly generalPartListService: GeneralPartListService) {}

  @Get(':order/:item')
  getGPL(@Param('order') order: string, @Param('item') item: string) {
    return this.generalPartListService.getGPL(order, item);
  }
}
