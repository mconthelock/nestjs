import { Controller, Get, Param } from '@nestjs/common';
import { IsDevService } from './is-dev.service';
@Controller('form/is/is-dev')
export class IsDevController {
  constructor(private readonly dev: IsDevService) {}

  @Get()
  findAll() {
    return this.dev.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dev.findOne(+id);
  }
}
