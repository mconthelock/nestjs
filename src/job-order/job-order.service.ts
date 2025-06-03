import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VJobOrder } from './entities/job-order.entity';
import { CreateJobOrderDto } from './dto/create-job-order.dto';
import { UpdateJobOrderDto } from './dto/update-job-order.dto';
import { SearchJobOrderDto } from './dto/search-job-order.dto';

@Injectable()
export class JobOrderService {
  constructor(
    @InjectRepository(VJobOrder, 'amecConnection')
    private readonly jobOrderRepository: Repository<VJobOrder>,
  ) {}

  findAll() {
    return this.jobOrderRepository.find();
  }

  async findOne(PRNO: number) {
    const data = await this.jobOrderRepository.findOne({
      where: { PRNO: PRNO },
    });
    return data;
  }

  async search(dto: SearchJobOrderDto) {
    const { ORDTYPE, PRJ_NO, MFGNO, BUYEREMPNO, BUYERNAME, PRNO, PRDATE, PONO, PODATE, LINENO, VENDCODE, ITEM, DRAWING, INVOICE, DUEDATE } = dto;
    const query = this.jobOrderRepository.createQueryBuilder('jobOrder');

    console.log(PRNO);
    

    if (ORDTYPE) {
      query.andWhere('jobOrder.ORDTYPE = :ORDTYPE', { ORDTYPE });
    }

    if (PRJ_NO) {
      query.andWhere('jobOrder.PRJ_NO = :PRJ_NO', { PRJ_NO });
    }

    if (MFGNO) {
      query.andWhere('jobOrder.MFGNO = :MFGNO', { MFGNO });
    }

    if (BUYEREMPNO) {
      query.andWhere('jobOrder.BUYEREMPNO = :BUYEREMPNO', { BUYEREMPNO });
    }

    if (BUYERNAME) {
      query.andWhere('jobOrder.BUYERNAME LIKE :BUYERNAME', { BUYERNAME: `%${BUYERNAME}%` });
    }

    if (PRNO) {
      query.andWhere('jobOrder.PRNO = :PRNO', { PRNO });
    }

    if (PRDATE) {
      query.andWhere('jobOrder.PRDATE = :PRDATE', { PRDATE });
    }

    if (PONO) {
      query.andWhere('jobOrder.PONO = :PONO', { PONO });
    }

    if (PODATE) {
      query.andWhere('jobOrder.PODATE = :PODATE', { PODATE });
    }

    if (LINENO) {
      query.andWhere('jobOrder.LINENO = :LINENO', { LINENO });
    }

    if (VENDCODE) {
      query.andWhere('jobOrder.VENDCODE = :VENDCODE', { VENDCODE });
    }

    if (ITEM) {
      query.andWhere('jobOrder.ITEM LIKE :ITEM', { ITEM: `%${ITEM}%` });
    }

    if (DRAWING) {
      query.andWhere('jobOrder.DRAWING LIKE :DRAWING', { DRAWING: `%${DRAWING}%` });
    }

    if (INVOICE) {
      query.andWhere('jobOrder.INVOICE LIKE :INVOICE', { INVOICE: `%${INVOICE}%` });
    }

    if (DUEDATE) {
      query.andWhere('jobOrder.DUEDATE = :DUEDATE', { DUEDATE });
    }

    return await query.getMany();
  }
}
