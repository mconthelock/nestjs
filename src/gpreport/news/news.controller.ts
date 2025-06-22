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

  //   @Post()
  //   create(@Body() createNewsDto: CreateNewsDto) {
  //     return this.newsService.create(createNewsDto);
  //   }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.newsService.findOne(+id);
  //   }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
  //     return this.newsService.update(+id, updateNewsDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.newsService.remove(+id);
  //   }
}
