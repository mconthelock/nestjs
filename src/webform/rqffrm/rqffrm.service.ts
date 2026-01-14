import { Injectable } from '@nestjs/common';
import { CreateRqffrmDto } from './dto/create-rqffrm.dto';
import { UpdateRqffrmDto } from './dto/update-rqffrm.dto';
import { FormDto } from '../form/dto/form.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { RQFFRM } from 'src/common/Entities/webform/tables/RQFFRM.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RqffrmService {
  constructor(
    @InjectRepository(RQFFRM, 'webformConnection')
    private repo: Repository<RQFFRM>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
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
}
