import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TermService } from './term.service';

@Controller('term')
export class TermController {
  constructor(private readonly termService: TermService) {}
}
