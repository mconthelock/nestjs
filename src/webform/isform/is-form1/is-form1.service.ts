import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// import { IsForm1 } from './entities/is-form1.entity';
import { Workplan } from '../../../docinv/workplan/entities/workplan.entity';

@Injectable()
export class IsForm1Service {
  constructor(
    @InjectRepository(Workplan, 'amecConnection')
    private readonly plan: Repository<Workplan>,
  ) {}

  findByYear(year: string) {
    return this.plan.find({
      where: { PLANYEAR: year },
      relations: {
        planfrm: {
          form: true,
        },
        workpic: true,
      },
    });
  }
}
