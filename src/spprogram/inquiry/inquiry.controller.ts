import { Controller, Post, Body } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { searchDto } from './dto/search.dto';

@Controller('sp/inquiry')
export class InquiryController {
  constructor(private readonly inq: InquiryService) {}

  @Post('search')
  async search(@Body() searchDto: searchDto) {
    return await this.inq.search(searchDto);
  }
}
