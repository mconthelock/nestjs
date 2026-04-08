import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EbgreqattfileService } from './ebgreqattfile.service';

@Controller('ebudget/file')
export class EbgreqattfileController {
  constructor(private readonly ebgreqattfileService: EbgreqattfileService) {}
}
