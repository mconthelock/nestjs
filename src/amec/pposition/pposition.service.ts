import { PPOSITION } from 'src/common/Entities/amec/table/PPOSITION.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository , In } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PpositionService {
  constructor(
    @InjectRepository(PPOSITION, 'webformConnection')
    private readonly spos: Repository<PPOSITION>,
  ) {}

  findAll() {
    return this.spos.find({ relations: ['wage'] });
  }

  findSpecificPositions(sposCodes: string[] = ['10', '11', '20', '21', '30']) {
    return this.spos.find({
      where: {
        // ค้นหาตำแหน่งที่ sposcode ตรงกับค่าในอาร์เรย์ที่ส่งมา
        SPOSCODE: In(sposCodes),
      }

    });
  }


}
