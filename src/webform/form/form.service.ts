import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from './entities/form.entity';
import { Flow } from './../flow/entities/flow.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form, 'amecConnection')
    private readonly form: Repository<Form>,

    @InjectRepository(Flow, 'amecConnection')
    private readonly flow: Repository<Flow>,
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

  waitforapprove(empno) {
    return this.flow
      .createQueryBuilder('flow')
      .leftJoinAndSelect('flow.form', 'form')
      .leftJoinAndSelect('form.formmst', 'formmst')
      .leftJoinAndSelect('form.flow', 'form_flow') // relation ใน entity ต้องตั้งชื่อถูก
      .where(
        '(flow.CSTEPST = :step AND flow.VAPVNO = :empno) OR (flow.CSTEPST = :step AND flow.VREPNO = :empno)',
        { step: '3', empno },
      )
      .andWhere('flow.CSTEPNO = form_flow.CSTEPNEXTNO')
      .getMany();
  }

  mine(empno) {
    return true;
  }
}
