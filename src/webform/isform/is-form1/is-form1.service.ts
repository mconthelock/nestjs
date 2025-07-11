import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Equal } from 'typeorm';
import { Workplan } from '../../../docinv/workplan/entities/workplan.entity';

@Injectable()
export class IsForm1Service {
  constructor(
    @InjectRepository(Workplan, 'amecConnection')
    private readonly plan: Repository<Workplan>,
  ) {}

  async findByYear(year: string) {
    return this.plan.find({
      where: { PLANYEAR: year, CATEGORY: '1' },
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

  async findRPA(year: string) {
    return this.plan.find({
      where: { PLANYEAR: year, CATEGORY: '4' },
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

  async findOne(id: number) {
    return this.plan.findOne({
      where: { PLANID: id },
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
}
