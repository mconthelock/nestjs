import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IsDev } from './entities/is-dev.entity';

@Injectable()
export class IsDevService {
  constructor(
    @InjectRepository(IsDev, 'amecConnection')
    private readonly isdev: Repository<IsDev>,
  ) {}

  async findByYear(year) {
    const results = await this.isdev.find({
      where: { CYEAR2: year },
      relations: {
        form: {
          flow: true,
          creator: true,
        },
      },
      order: { NRUNNO: 'ASC' },
    });

    // Filter only flow with CSTEPNO = '00'
    return results.map((isdev) => {
      if (Array.isArray(isdev.form.flow)) {
        const manager = isdev.form.flow.find((f) => f.CSTEPNO === '10');
        const pic = isdev.form.flow.find((f) => f.CSTEPNEXTNO === '00');
        const running = isdev.form.flow.find((f) => f.CSTEPST === '3');

        isdev.form = { ...isdev.form, ...{ manager } };
        isdev.form = { ...isdev.form, ...{ pic } };
        isdev.form = { ...isdev.form, ...{ running } };
        delete isdev.form.flow;
      }
      return isdev;
    });
  }
}
