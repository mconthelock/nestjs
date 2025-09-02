import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Workplan } from './entities/workplan.entity';
import { WorkplanDoc } from './entities/workplan-doc.entity';
// import { WorkplanDoc } from './entities/workplan-doc.entity';

@Injectable()
export class WorkplanService {
  constructor(
    @InjectRepository(Workplan, 'docinvConnection')
    private readonly workplan: Repository<Workplan>,

    @InjectRepository(WorkplanDoc, 'docinvConnection')
    private readonly docs: Repository<WorkplanDoc>,
  ) {}

  findAttachment(id) {
    return this.docs.find({ where: { PLANID: id } });
  }

  findDocuments(year) {
    return this.workplan.find({
      where: { PLANYEAR: year },
      relations: {
        planfrm: { form: true },
        form3: { flow: true },
        form4: { flow: true },
        spec: true,
        release: true,
      },
    });
  }
}
