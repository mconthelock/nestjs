import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HeaderService } from './header.service';

@ApiTags('ID Tag')
@Controller('idtag')
export class HeaderController {
  constructor(private readonly tag: HeaderService) {}

  @Get('schd/:schd/:schdp')
  @ApiOperation({
    summary: 'Get AMEC Calendar by specify Start date and End date',
  })
  findBySchd(@Param('schd') schd: string, @Param('schd') schdp: string) {
    return this.tag.findBySchd(schd, schdp);
  }
}
