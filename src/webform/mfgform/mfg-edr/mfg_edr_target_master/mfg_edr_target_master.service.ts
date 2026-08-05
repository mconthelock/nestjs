import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMfgEdrTargetMasterDto } from './dto/create_mfg_edr_target_master.dto';
import { SearchMfgEdrTargetMasterDto } from './dto/search_mfg_edr_target_master.dto';
import { UpdateMfgEdrTargetMasterDto } from './dto/update_mfg_edr_target_master.dto';
import { MfgEdrTargetMaster } from '../../../../common/Entities/webform/table/mfg_edr_target_master.entity';

@Injectable()
export class MfgEdrTargetMasterService {
  constructor(
    @InjectRepository(MfgEdrTargetMaster, 'webformConnection')
    private readonly targetMasterRepository: Repository<MfgEdrTargetMaster>,
  ) {}

  async create(
    dto: CreateMfgEdrTargetMasterDto,
  ): Promise<MfgEdrTargetMaster> {
    const existing = await this.targetMasterRepository.findOne({
      where: {
        FYEAR: dto.FYEAR,
        SSECCODE: dto.SSECCODE,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Target FYEAR ${dto.FYEAR} and SSECCODE ${dto.SSECCODE} already exists`,
      );
    }

    const entity = this.targetMasterRepository.create(dto);
    return this.targetMasterRepository.save(entity);
  }

  async findAll(): Promise<MfgEdrTargetMaster[]> {
    return this.targetMasterRepository.find({
      order: {
        FYEAR: 'DESC',
        SSECCODE: 'ASC',
      },
    });
  }

  async search(dto: SearchMfgEdrTargetMasterDto): Promise<any[]> {
    return this.targetMasterRepository
      .createQueryBuilder('A')
      .innerJoin(
        'ORGANIZATIONS',
        'B',
        'A.SSECCODE = B.SSECCODE',
      )
      .select([
        'A.FYEAR AS "FYEAR"',
        'A.SSECCODE AS "SSECCODE"',
        'A.JAN AS "JAN"',
        'A.FEB AS "FEB"',
        'A.MAR AS "MAR"',
        'A.APR AS "APR"',
        'A.MAY AS "MAY"',
        'A.JUN AS "JUN"',
        'A.JUL AS "JUL"',
        'A.AUG AS "AUG"',
        'A.SEP AS "SEP"',
        'A.OCT AS "OCT"',
        'A.NOV AS "NOV"',
        'A.DEC AS "DEC"',
        'B.SDEPCODE AS "SDEPCODE"',
      ])
      .where('A.FYEAR = :FYEAR', { FYEAR: dto.FYEAR })
      .orderBy('A.SSECCODE', 'ASC')
      .getRawMany();
  }

  async findOne(
    FYEAR: number,
    SSECCODE: string,
  ): Promise<MfgEdrTargetMaster> {
    const result = await this.targetMasterRepository.findOne({
      where: {
        FYEAR,
        SSECCODE,
      },
    });

    if (!result) {
      throw new NotFoundException(
        `Target FYEAR ${FYEAR} and SSECCODE ${SSECCODE} not found`,
      );
    }

    return result;
  }

  async update(
    FYEAR: number,
    SSECCODE: string,
    dto: UpdateMfgEdrTargetMasterDto,
  ): Promise<MfgEdrTargetMaster> {
    const entity = await this.findOne(FYEAR, SSECCODE);

    this.targetMasterRepository.merge(entity, dto);
    return this.targetMasterRepository.save(entity);
  }

  async remove(
    FYEAR: number,
    SSECCODE: string,
  ): Promise<{ message: string }> {
    const entity = await this.findOne(FYEAR, SSECCODE);

    await this.targetMasterRepository.remove(entity);

    return {
      message: `Target FYEAR ${FYEAR} and SSECCODE ${SSECCODE} deleted successfully`,
    };
  }
}