import { Body, Controller, Post } from '@nestjs/common';
import { IdtagService } from './idtag.service';
import { searchTagDto } from './dto/search-tag.dto';

@Controller('as400/idtag')
export class IdtagController {
  constructor(private readonly tags: IdtagService) {}

  @Post('search')
  async findShop(@Body() body: searchTagDto) {
    const result = await this.tags.search(body);
    return result;
  }
}
