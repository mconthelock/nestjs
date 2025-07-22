import { Injectable } from '@nestjs/common';
import { CreateQainsOperatorAuditorDto } from './dto/create-qains_operator_auditor.dto';
import { UpdateQainsOperatorAuditorDto } from './dto/update-qains_operator_auditor.dto';

@Injectable()
export class QainsOperatorAuditorService {
  create(createQainsOperatorAuditorDto: CreateQainsOperatorAuditorDto) {
    return 'This action adds a new qainsOperatorAuditor';
  }

  findAll() {
    return `This action returns all qainsOperatorAuditor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} qainsOperatorAuditor`;
  }

  update(id: number, updateQainsOperatorAuditorDto: UpdateQainsOperatorAuditorDto) {
    return `This action updates a #${id} qainsOperatorAuditor`;
  }

  remove(id: number) {
    return `This action removes a #${id} qainsOperatorAuditor`;
  }
}
