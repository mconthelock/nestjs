import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EbgreqcolImageService } from './ebgreqcol-image.service';
import { CreateEbgreqcolImageDto } from './dto/create-ebgreqcol-image.dto';
import { UpdateEbgreqcolImageDto } from './dto/update-ebgreqcol-image.dto';

@Controller('ebudget/image')
export class EbgreqcolImageController {
  constructor(private readonly ebgreqcolImageService: EbgreqcolImageService) {}

}
