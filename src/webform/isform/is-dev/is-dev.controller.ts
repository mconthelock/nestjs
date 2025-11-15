import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsDevService } from './is-dev.service';
import { SearchIsDevDto } from './dto/search-is-dev.dto';

@ApiTags('IS-DEV')
@Controller('form/is/is-dev')
export class IsDevController {
  constructor(private readonly dev: IsDevService) {}

  @Post('/search')
  async search(@Body() searchDto: SearchIsDevDto) {
    const year = '2014';
    return this.dev.search(year, searchDto.keyword);
  }

  @Get('/year/:year')
  @ApiOperation({
    summary: 'Get by Year',
    description:
      'Get all IS-DEV Form that request in specific Year, Data including Form/IS-DEV/Requestor (Exclude flow Data)',
  })
  findByYear(@Param('year') year: string) {
    return this.dev.findByYear(year);
  }

  @Get('/year/:year/id/:id')
  @ApiOperation({
    summary: 'Get by id',
    description:
      'Get all IS-DEV Form that request in specific Year, Data including Form/IS-DEV/Requestor (Exclude flow Data)',
  })
  findById(@Param('year') year: string, @Param('id') id: number) {
    return this.dev.findById(year, id);
  }
}
