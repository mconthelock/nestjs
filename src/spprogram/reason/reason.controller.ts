import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReasonService } from './reason.service';

@Controller('reason')
export class ReasonController {
  constructor(private readonly reasonService: ReasonService) {}
}
