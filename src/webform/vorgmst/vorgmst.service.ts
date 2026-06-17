import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVorgmstDto } from './dto/create-vorgmst.dto';
import { UpdateVorgmstDto } from './dto/update-vorgmst.dto';
import { VORGMST } from 'src/common/Entities/webform/views/VORGMST.entity';

@Injectable()
export class VorgmstService {constructor(
    @InjectRepository(VORGMST, 'webformConnection') // ระบุชื่อ connection ของคุณเหมือนตัว pposition
    private readonly vorgmstRepository: Repository<VORGMST>,
  ) {}
  create(createVorgmstDto: CreateVorgmstDto) {
    return 'This action adds a new vorgmst';
  }

  async findAllActive() {
    return await this.vorgmstRepository.createQueryBuilder('vorg')
      .where('UPPER(vorg.VNAME) NOT LIKE :VNAME', { VNAME: '%CANCEL%' })
      .andWhere('UPPER(vorg.VDESC) NOT LIKE :VDESC', { VDESC : '%CANCEL%' })
      .orderBy('vorg.CTYPE', 'ASC') // หรือ 'DESC' ตามที่คุณต้องการเรียงลำดับ
      .getMany();
  }

  findAll() {
    return `This action returns all vorgmst`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vorgmst`;
  }

  update(id: number, updateVorgmstDto: UpdateVorgmstDto) {
    return `This action updates a #${id} vorgmst`;
  }

  remove(id: number) {
    return `This action removes a #${id} vorgmst`;
  }
}
