import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EbgreqattfileService } from './ebgreqattfile.service';
import { CreateEbgreqattfileDto } from './dto/create-ebgreqattfile.dto';
import { UpdateEbgreqattfileDto } from './dto/update-ebgreqattfile.dto';

@Controller('ebgreqattfile')
export class EbgreqattfileController {
  constructor(private readonly ebgreqattfileService: EbgreqattfileService) {}
}
