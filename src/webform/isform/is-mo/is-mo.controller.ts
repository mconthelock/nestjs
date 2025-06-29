import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsMoService } from './is-mo.service';

@ApiTags('IS-MO')
@Controller('is-mo')
export class IsMoController {
  constructor(private readonly ismo: IsMoService) {}

  @Get('/year/:year')
  @ApiOperation({
    summary: 'Get by Year',
    description:
      'Get all IS-DEV Form that request in specific Year, Data including Form/IS-DEV/Requestor (Exclude flow Data)',
  })
  findByYear(@Param('year') year: string) {
    //return this.dev.findByYear(year);
    return '';
  }
}
