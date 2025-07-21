import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TermService } from './term.service';

@Controller('sp/term')
export class TermController {
  constructor(private readonly term: TermService) {}

  @Get()
  findAll() {
    return this.term.findAll();
  }
}
