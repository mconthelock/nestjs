import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Form } from './entities/form.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form, 'amecConnection')
    private readonly form: Repository<Form>,
  ) {}

  findOne(fno, orgno, cyear, cyear2, nrunno) {
    return this.form.find({
      where: {
        NFRMNO: fno,
        VORGNO: orgno,
        CYEAR: cyear,
        CYEAR2: cyear2,
        NRUNNO: nrunno,
      },
      relations: {
        flow: true,
        creator: true,
      },
    });
  }
}
