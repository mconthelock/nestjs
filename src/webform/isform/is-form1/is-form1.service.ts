import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Between,
  Equal,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';

// import { IsForm1 } from './entities/is-form1.entity';
import { Workplan } from '../../../docinv/workplan/entities/workplan.entity';

@Injectable()
export class IsForm1Service {
  constructor(
    @InjectRepository(Workplan, 'amecConnection')
    private readonly plan: Repository<Workplan>,
  ) {}

  async findByYear(year: string) {
    return this.plan.find({
      where: { PLANYEAR: year },
      relations: {
        planfrm: {
          form: true,
        },
        workpic: {
          developer: true,
        },
      },
      cache: true,
    });
  }

  async findByStatus(status: number) {
    let q = {};
    switch (status) {
      case 1: //Wait for approve
        q = { STATUS_ID: Between(0, 2) };
        break;
      case 2: //Running
        q = { STATUS_ID: Between(3, 7) };
        break;
      case 3: //Complete
        q = { STATUS_ID: Equal(8) };
        break;
      case 4: //Postpone
        q = { STATUS_ID: Between(50, 100) };
        break;
      default:
        q = { STATUS_ID: Between(0, 100) };
        break;
    }
    return this.plan.find({
      where: q,
      relations: {
        planfrm: {
          form: true,
        },
        workpic: {
          developer: true,
        },
      },
    });
  }
}
