import { Injectable } from '@nestjs/common';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SearchOvertimeDto } from './dto/search-overtime.dto';
import { Overtime } from 'src/common/Entities/gpreport/table/overtime.entity';

@Injectable()
export class OvertimeService {
  constructor(
    @InjectRepository(Overtime, 'gpreportConnection')
    private readonly otRepo: Repository<Overtime>,

    @InjectDataSource('gpreportConnection')
      private readonly dataSource: DataSource,
  ) {}

 
  create(createOvertimeDto: CreateOvertimeDto) {
    return 'This action adds a new overtime';
  }
  

  async findAll(q: SearchOvertimeDto) {
    return await this.otRepo.find({ where: q });
  }


  findOne(id: number) {
    return `This action returns a #${id} overtime`;
  }

  update(id: number, updateOvertimeDto: UpdateOvertimeDto) {
    return `This action updates a #${id} overtime`;
  }

  remove(id: number) {
    return `This action removes a #${id} overtime`;
  }

  async getOtByWorkdate(workdate: string) {
    return await this.dataSource
      .createQueryBuilder()
      .select(['A.CYEAR2 AS CYEAR2, A.NRUNNO AS NRUNNO, A.EMPNO AS EMPNO',`TO_CHAR(A.WORKDATE,'DD-MM-YYYY') AS WORKDATE`,'A.TIMEIN AS TIMEIN', 'A.TIMEOUT AS TIMEOUT',
         'A.WKTYPENO AS WKTYPENO' ,'B.CST AS CST','C.SNAME AS SNAME','C.SSEC AS SSEC','C.SDEPT AS SDEPT','C.SDIV AS SDIV',])
      .from('OTFORM', 'A')
      .innerJoin('FORM', 'B',`A.NFRMNO = B.NFRMNO AND A.VORGNO = B.VORGNO AND A.CYEAR = B.CYEAR AND A.CYEAR2 = B.CYEAR2 AND A.NRUNNO = B.NRUNNO`,)
      .leftJoin('AMECUSERALL', 'C', 'A.EMPNO = C.SEMPNO')
      .where(`(A.WORKDATE) = TO_DATE(:workdate,'DD-MM-YYYY')`, { workdate })
      .andWhere('B.CST IN (1,2)')
      .getRawMany();
  }


}
