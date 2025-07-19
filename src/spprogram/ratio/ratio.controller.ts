import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RatioService } from './ratio.service';

@Controller('sp/priceratio')
export class RatioController {
  constructor(private readonly ratio: RatioService) {}

  @Get()
  findAll() {
    return this.ratio.findAll();
  }
}
