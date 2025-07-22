import { Controller, Get } from '@nestjs/common';
import { MethodService } from './method.service';

@Controller('sp/method')
export class MethodController {
  constructor(private readonly methodService: MethodService) {}

  @Get()
  findAll() {
    return this.methodService.findAll();
  }
}
