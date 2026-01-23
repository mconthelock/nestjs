import { Injectable } from '@nestjs/common';
import { CreateRqffrmDto } from './dto/create-rqffrm.dto';
import { UpdateRqffrmDto } from './dto/update-rqffrm.dto';
import { FormDto } from '../form/dto/form.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { RQFFRM } from 'src/common/Entities/webform/tables/RQFFRM.entity';
import { DataSource, Repository } from 'typeorm';
import { FormService } from '../form/form.service';

@Injectable()
export class RqffrmService {
  constructor(
    @InjectRepository(RQFFRM, 'webformConnection')
    private repo: Repository<RQFFRM>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
    private formService: FormService,
  ) {}

  async getData(dto: FormDto) {
    return this.repo.findOne({
      where: {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
      },
    });
  }

  async findFromYear(FYear: string) {
    const quotation = await this.repo.find({
      where: {
        FYEAR: FYear,
      },
      relations:{
        RQFLIST: true
      },
    });
    const form = [];
    for (const q of quotation) {
        const formDetail = await this.formService.getFormDetail({
            NFRMNO: q.NFRMNO,
            VORGNO: q.VORGNO,
            CYEAR: q.CYEAR,
            CYEAR2: q.CYEAR2,
            NRUNNO: q.NRUNNO
        });
        formDetail.data = q;
        form.push(formDetail);
    }
    return form;
  }

//   findAll() {
//     return this.repo.find({
//       where: {
//         FYEAR: FYear,
//       },
//       relations:{
//         RQFLIST: true
//       },
//     });
//   }
}
