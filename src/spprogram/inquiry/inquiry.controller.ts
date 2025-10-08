import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { searchDto } from './dto/search.dto';
import { inqDataDto } from './dto/update-data.dto';

@Controller('sp/inquiry')
export class InquiryController {
  constructor(private readonly inq: InquiryService) {}

  @Post('search')
  async search(@Body() searchDto: searchDto) {
    return await this.inq.search(searchDto);
  }

  @Post('create')
  async create(@Body() req: any) {
    const data = await this.inq.create(
      req.header,
      req.details,
      req.timelinedata || undefined,
      req.history || undefined,
    );
    return await this.inq.findByNumber(req.header.INQ_NO);
  }

  @Post('update')
  async update(@Body() req: inqDataDto) {
    const data = await this.inq.update(
      req.header,
      req.details || [],
      req.deleteLine || [],
      req.deleteFile || [],
      req.timelinedata,
      req.history,
    );

    return await this.inq.findByNumber(req.header.INQ_NO);
  }

  @Post('revise')
  async revise(@Body() req: any) {
    return await this.inq.revise(req.id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.inq.findOne(id);
  }

  @Post('delete')
  async delete(@Body() searchDto: searchDto) {
    return await this.inq.delete(searchDto);
  }

  @Post('report')
  async report(@Body() searchDto: searchDto) {
    return await this.inq.report(searchDto);
  }
}
