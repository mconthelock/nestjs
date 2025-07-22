import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QainsOperatorAuditorService } from './qains_operator_auditor.service';
import { CreateQainsOperatorAuditorDto } from './dto/create-qains_operator_auditor.dto';
import { UpdateQainsOperatorAuditorDto } from './dto/update-qains_operator_auditor.dto';

@Controller('qains-operator-auditor')
export class QainsOperatorAuditorController {
  constructor(private readonly qainsOperatorAuditorService: QainsOperatorAuditorService) {}

  @Post()
  create(@Body() createQainsOperatorAuditorDto: CreateQainsOperatorAuditorDto) {
    return this.qainsOperatorAuditorService.create(createQainsOperatorAuditorDto);
  }

  @Get()
  findAll() {
    return this.qainsOperatorAuditorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qainsOperatorAuditorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQainsOperatorAuditorDto: UpdateQainsOperatorAuditorDto) {
    return this.qainsOperatorAuditorService.update(+id, updateQainsOperatorAuditorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qainsOperatorAuditorService.remove(+id);
  }
}
