import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Ratio } from './entities/ratio.entity';
import { createDto } from './dto/create.dto';
import { findOneDto } from './dto/findone.dto';

@Injectable()
export class RatioService {
  constructor(
    @InjectRepository(Ratio, 'spsysConnection')
    private readonly ratio: Repository<Ratio>,
  ) {}

  findAll() {
    return this.ratio.find({ relations: ['quoText'] });
  }

  findOne(findOneDto: findOneDto) {
    return this.ratio.find({
      where: findOneDto,
      relations: ['quoText'],
    });
  }

  findID(id: number) {
    return this.ratio.find({
      where: { ID: id },
      relations: ['quoText'],
    });
  }

  async create(createDto: createDto) {
    const dt = this.ratio.create(createDto);
    const res = await this.ratio.save(dt);
    return this.ratio.find({
      where: { ID: res.ID },
      relations: ['quoText'],
    });
  }

  async update(createDto: createDto) {
    const record = await this.ratio.find({
      where: { ID: createDto.ID },
    });
    const updatedRatio = { ...record[0], ...createDto };

    const res = await this.ratio.save(updatedRatio);
    return this.ratio.find({
      where: { ID: res.ID },
      relations: ['quoText'],
    });
  }

  async toggleStatus(id: number, status: number) {
    const record = await this.ratio.find({
      where: { ID: id },
    });
    const updatedRatio = { ...record[0], STATUS: status };
    const res = await this.ratio.save(updatedRatio);
    return this.ratio.find({
      where: { ID: res.ID },
      relations: ['quoText'],
    });
  }

  // เพิ่ม method สำหรับค้นหา ratio ที่มี TRADER = 'Direct' และ SUPPLIER = 'AMEC'
  findDirectAmec() {
    return this.ratio.find({
      where: {
        TRADER: 'Direct',
        SUPPLIER: 'AMEC',
      },
      relations: ['quoText', 'direct'],
    });
  }

  // หรือค้นหาด้วย query builder สำหรับ join ที่ซับซ้อนกว่า
  async findWithDirectAmecCondition() {
    return this.ratio
      .createQueryBuilder('ratio')
      .leftJoinAndSelect('ratio.quoText', 'quoText')
      .leftJoinAndSelect('ratio.direct', 'direct')
      .where('ratio.TRADER = :trader', { trader: 'Direct' })
      .andWhere('ratio.SUPPLIER = :supplier', { supplier: 'AMEC' })
      .getMany();
  }
}
