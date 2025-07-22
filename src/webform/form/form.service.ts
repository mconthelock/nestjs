import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from './entities/form.entity';
import { Flow } from './../flow/entities/flow.entity';

import { getFormnoDto } from 'src/webform/form/dto/get-formno.dto';
import { FormmstService } from '../formmst/formmst.service';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form, 'amecConnection')
    private readonly form: Repository<Form>,

    @InjectRepository(Flow, 'amecConnection')
    private readonly flow: Repository<Flow>,

    private readonly formmstService: FormmstService,
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

  async getFormno(dto: getFormnoDto, host: string): Promise<string> {
    const form = await this.formmstService.getFormmst(dto, host);
    console.log(form);
    // เอาเลขปี 2 หลักสุดท้าย
    const year2 = dto.CYEAR2.substring(2, 4); // ถ้า "2024" ได้ "24"

    // เติมเลข running 6 หลัก (ถ้าเป็นเลข integer ให้แปลงเป็น string ก่อน)
    const runNo = String(dto.NRUNNO).padStart(6, '0'); // เช่น 1 => "000001"
    return `${form[0].VANAME}${year2}-${runNo}`;
  }
}
