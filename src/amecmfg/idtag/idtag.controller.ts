import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IdtagService } from './idtag.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('AS400 - ID Tag')
@Controller('idtag')
export class IdtagController {
  constructor(private readonly tag: IdtagService) {}

  @Post('schd')
  findBySchd(@Body() body: { schd: string; schdp?: string }) {
    return this.tag.findBySchd(body.schd, body.schdp);
  }

  @Get('bmdate/:date')
  findByBMDate(@Param('date') date: string) {
    return this.tag.findByBMDate(date);
  }

  @Get('all')
  findAll() {
    return this.tag.findAll();
  }

  @Get('shop/:schd/:schdp/:shop')
  @ApiOperation({
    summary: 'Get AMEC Calendar by specify Start date and End date',
  })
  async findByShop(
    @Param('schd') schd: string,
    @Param('schdp') schdp: string,
    @Param('shop') shop: string,
  ) {
    const data = await this.tag.findBySchd(schd, schdp);
    const result = data
      .map((item) => {
        const newItem = { ...item };
        newItem.tags = item.tags.filter((tag) => {
          return tag.process.some((pc) => pc.F02R03.substring(0, 2) === shop);
        });
        return newItem;
      })
      .filter((item) => item.tags.length > 0);
    return result;
  }
}
