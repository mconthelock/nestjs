import { Injectable } from '@nestjs/common';
import { SearchWorkAnnualDevPlanDto } from './dto/search-work-annual-dev-plan.dto';
import { WorkAnnualDevPlan } from './entities/work-annual-dev-plan.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WorkAnnualDevPlanService {
  constructor(
    @InjectRepository(WorkAnnualDevPlan, 'docinvConnection')
    private readonly repo: Repository<WorkAnnualDevPlan>,
    @InjectDataSource('docinvConnection')
    private dataSource: DataSource,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findFyear(fyear: number) {
    return this.repo.find({ where: { PLANYEAR: fyear } });
  }
}
