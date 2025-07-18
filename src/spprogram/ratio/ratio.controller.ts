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

@Controller('ratio')
export class RatioController {
  constructor(private readonly ratioService: RatioService) {}
}
