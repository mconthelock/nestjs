import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateSequenceOrgDto } from './dto/create-sequence-org.dto';
import { UpdateSequenceOrgDto } from './dto/update-sequence-org.dto';
import { SequenceOrg } from './entities/sequence-org.entity';

@Injectable()
export class SequenceOrgService {
  constructor(
    @InjectRepository(SequenceOrg, 'amecConnection')
    private readonly seqRepo: Repository<SequenceOrg>,

    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}
  create(createSequenceOrgDto: CreateSequenceOrgDto) {
    return 'This action adds a new sequenceOrg';
  }

  findAll() {
    return this.seqRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} sequenceOrg`;
  }

  update(id: number, updateSequenceOrgDto: UpdateSequenceOrgDto) {
    return `This action updates a #${id} sequenceOrg`;
  }

  remove(id: number) {
    return `This action removes a #${id} sequenceOrg`;
  }

  async getManager(empno: string) {
    return this.seqRepo
      .createQueryBuilder('seq')
      .select('seq.HEADNO', 'HEADNO')
      .where('seq.EMPNO = :empno', { empno })
      .andWhere(
        'seq.SPOSCODE = (select SPOSCODE from AEMPLOYEE where sEmpNo = :empno2)',
        { empno2: empno },
      )
      .orderBy('seq.CCO', 'ASC')
      .getRawMany();
  }
}
