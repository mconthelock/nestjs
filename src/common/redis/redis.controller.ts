import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestService } from './redis.service';

@Controller('test')
export class testcontroller {
  constructor(private readonly t: TestService) {}


  @Get()
  test() {
    return this.t.test();
  }

}
