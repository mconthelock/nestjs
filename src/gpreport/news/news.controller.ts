import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Controller('gpreport/news')
export class NewsController {
  constructor(private readonly news: NewsService) {}

  @Get()
  getAvailable() {
    return this.news.getAvailable();
  }
}
