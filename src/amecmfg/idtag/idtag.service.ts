import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { M008KP } from 'src/as400/rtnlibf/m008kp/entities/m008kp.entity';
import { F110KP } from 'src/amecmfg/f110kp/entities/f110kp.entity';
import { F001KP } from 'src/as400/shopf/f001kp/entities/f001kp.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IdtagService {
  constructor(
    @InjectRepository(M008KP, 'amecConnection')
    private readonly m08: Repository<M008KP>,
    @InjectRepository(F110KP, 'amecConnection')
    private readonly f11: Repository<F110KP>,
    @InjectRepository(F001KP, 'amecConnection')
    private readonly f01: Repository<F001KP>,
  ) {}

  async findBySchd(schd: string, schdp?: string) {
    const where: any = {};
    if (schd) where.M8K01 = schd;
    if (schdp) where.M8K02 = schdp;
    return this.m08.find({
      where: { ...where },
      relations: {
        bmdate: true,
        tags: { process: true, orders: true, detail: true },
      },
    });
  }

  // async findBySchd(schd: string, schdp?: string, item?: string) {
  //   const qb = this.m08
  //     .createQueryBuilder('m')
  //     .leftJoinAndSelect('m.bmdate', 'b')
  //     .leftJoinAndSelect('m.tags', 't')
  //     .leftJoinAndSelect('t.process', 'p')
  //     .leftJoinAndSelect('t.orders', 'o')
  //     .leftJoinAndSelect('t.detail', 'd');

  //   if (schd) {
  //     qb.andWhere('m.M8K01 = :schd', { schd });
  //   }

  //   if (schdp) {
  //     qb.andWhere('m.M8K02 = :schdp', { schdp });
  //   }

  //   if (item) {
  //     qb.andWhere('TRIM(t.F01R03) = :item', { item: item.trim() });
  //   }

  //   return qb.getMany();
  // }

  async findf110kpBySchd(schd: string,p?: string) {
    const where: any = {};
    if (schd) where.F11K05 = schd;
    if (p) where.F11K06 = p;
    return this.f11.find({
      where: { ...where },
    });
  }

  async findDetailByTag(tag: string) {
    return this.f11.find({
      where: { F11K01: tag },
    });
  }

  async findByBMDate(date: string) {
    return this.m08.find({
      where: { bmdate: { Q9PP: date } },
      relations: {
        bmdate: true,
        tags: { process: true, orders: true, detail: true },
      },
    });
  }

  async findAll() {
    return this.m08.find({
      relations: {
        bmdate: true,
        tags: { process: true, detail: true },
      },
    });
  }

  async getWeekList() {
    return this.f01
      .createQueryBuilder('f1')
      .select('f1.F01R02', 'F01R02')
      .innerJoin('f1.process', 'f2')
      .where('f2.F02R07 = :status', { status: 0 })
      .andWhere('f1.F01R02 > :week', { week: '2024080' })
      .groupBy('f1.F01R02')
      .orderBy('f1.F01R02', 'DESC')
      .getRawMany();
  }
}
