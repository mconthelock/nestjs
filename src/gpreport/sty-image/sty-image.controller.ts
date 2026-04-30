import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StyImageService } from './sty-image.service';
import { CreateStyImageDto } from './dto/create-sty-image.dto';
import { UpdateStyImageDto } from './dto/update-sty-image.dto';

@Controller('sty-image')
export class StyImageController {
  constructor(private readonly styImageService: StyImageService) {}

}
