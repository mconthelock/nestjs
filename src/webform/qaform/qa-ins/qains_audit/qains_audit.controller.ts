import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QainsAuditService } from './qains_audit.service';
import { CreateQainsAuditDto } from './dto/create-qains_audit.dto';
import { UpdateQainsAuditDto } from './dto/update-qains_audit.dto';

@Controller('qains-audit')
export class QainsAuditController {
  constructor(private readonly qainsAuditService: QainsAuditService) {}

  @Post()
  create(@Body() createQainsAuditDto: CreateQainsAuditDto) {
    return this.qainsAuditService.create(createQainsAuditDto);
  }

  @Get()
  findAll() {
    return this.qainsAuditService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qainsAuditService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQainsAuditDto: UpdateQainsAuditDto) {
    return this.qainsAuditService.update(+id, updateQainsAuditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qainsAuditService.remove(+id);
  }
}
