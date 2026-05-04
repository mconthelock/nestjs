import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StyPatrolService } from './sty-patrol.service';
import { CreateStyPatrolDto } from './dto/create-sty-patrol.dto';
import { UpdateStyPatrolDto } from './dto/update-sty-patrol.dto';

@Controller('sty-patrol')
export class StyPatrolController {
  constructor(private readonly styPatrolService: StyPatrolService) {}

}
