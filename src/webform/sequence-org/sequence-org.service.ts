import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { CreateSequenceOrgDto } from './dto/create-sequence-org.dto';
import { UpdateSequenceOrgDto } from './dto/update-sequence-org.dto';
import { SequenceOrg } from './entities/sequence-org.entity';
import { SearchSequenceOrgDto } from './dto/search-sequence-org.dto';

@Injectable()
export class SequenceOrgService {
  constructor(
    @InjectRepository(SequenceOrg, 'amecConnection')
    private readonly seqRepo: Repository<SequenceOrg>,

    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}

  findAll() {
    return this.seqRepo.find();
  }

  async getManager(empno: string, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(SequenceOrg)
      : this.seqRepo;
    return repo
      .createQueryBuilder('seq')
      .select('seq.HEADNO', 'HEADNO')
      .where('seq.EMPNO = :empno', { empno })
      .andWhere(
        'seq.SPOSCODE = (select SPOSCODE from AMECUSERALL where sEmpNo = :empno2)',
        { empno2: empno },
      )
      .orderBy('seq.CCO', 'ASC')
      .getRawMany();
  }

  async getSubordinates(empno: string) {
    const sql = `
         SELECT DISTINCT B.* FROM 
            (
                SELECT * FROM SEQUENCEORG
                START WITH HEADNO = :1 CONNECT BY PRIOR EMPNO = HEADNO AND PRIOR CCO = CCO1
            ) A
            JOIN AMECUSERALL B ON A.EMPNO = B.SEMPNO
            WHERE B.SEMPNO != :2  AND B.CSTATUS = 1
        `;
    return await this.dataSource.query(sql, [empno, empno]);
  }

  async search(dto: SearchSequenceOrgDto, queryRunner?: QueryRunner): Promise<SequenceOrg[]> {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(SequenceOrg)
      : this.seqRepo;
    return await repo.find({ where: dto });
  }
}
