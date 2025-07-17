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
import { CreateRatioDto } from './dto/create-ratio.dto';
import { UpdateRatioDto } from './dto/update-ratio.dto';

@Controller('ratio')
export class RatioController {
  constructor(private readonly ratioService: RatioService) {}
}
