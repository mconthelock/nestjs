import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HeaderService } from './header.service';

@ApiTags('AS400 - ID Tag')
@Controller('idtag')
export class HeaderController {
  constructor(private readonly tag: HeaderService) {}

  @Get('schd/:schd/:schdp')
  @ApiOperation({
    summary: 'Get AMEC Calendar by specify Start date and End date',
  })
  findBySchd(@Param('schd') schd: string, @Param('schdp') schdp: string) {
    return this.tag.findBySchd(schd, schdp);
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
