import { Injectable } from '@nestjs/common';
import { CreateQainsAuditDto } from './dto/create-qains_audit.dto';
import { UpdateQainsAuditDto } from './dto/update-qains_audit.dto';

@Injectable()
export class QainsAuditService {
  create(createQainsAuditDto: CreateQainsAuditDto) {
    return 'This action adds a new qainsAudit';
  }

  findAll() {
    return `This action returns all qainsAudit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} qainsAudit`;
  }

  update(id: number, updateQainsAuditDto: UpdateQainsAuditDto) {
    return `This action updates a #${id} qainsAudit`;
  }

  remove(id: number) {
    return `This action removes a #${id} qainsAudit`;
  }
}
