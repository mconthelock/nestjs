import { Body, Controller, Get, Post } from '@nestjs/common';
import { SecretlogService } from './secretlog.service';
import { createDocDto } from './dto/create.dto';

@Controller('hradmin/log')
export class SecretlogController {
  constructor(private readonly docs: SecretlogService) {}

  @Get()
  findAll() {
    return this.docs.findAll();
  }

  @Post('create')
  create(@Body() data: createDocDto) {
    return this.docs.create(data);
  }
}
