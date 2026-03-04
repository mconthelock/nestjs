import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBuspassengerDto } from './dto/create-buspassenger.dto';
import { UpdateBuspassengerDto } from './dto/update-buspassenger.dto';
import { Buspassenger } from 'src/common/Entities/gpreport/table/buspassenger.entity';
import { User } from 'src/amec/users/entities/user.entity';

@Injectable()
export class BuspassengerService {
  constructor(
    @InjectRepository(Buspassenger, 'gpreportConnection')
    private readonly buspassengerRepository: Repository<Buspassenger>,

    @InjectDataSource('gpreportConnection')
    private readonly dataSource: DataSource,

    @InjectRepository(User, 'gpreportConnection')  
    private readonly userRepo: Repository<User>,
  ) {}

   async findAll(q: UpdateBuspassengerDto) {
      return await this.buspassengerRepository.find({ where: q });
  }

  async create(dto: CreateBuspassengerDto) {
  const entity = this.buspassengerRepository.create({
    ...dto,
    UPDATE_DATE: new Date(),   // 👈 เพิ่มตรงนี้
  });
  return await this.buspassengerRepository.save(entity);
}
  
  async update(dto: UpdateBuspassengerDto) {
    const data = await this.buspassengerRepository.findOne({
      where: { EMPNO: dto.EMPNO, STATENO: dto.STATENO },
    });

    if (!data) {
      throw new NotFoundException(`Passenger is not found`);
    }

    Object.assign(data, dto);
    data.UPDATE_DATE = new Date();  
    data.UPDATE_BY = dto.UPDATE_BY;

    return await this.buspassengerRepository.save(data);
  }


  async delete(dto: UpdateBuspassengerDto) {
      const data = await this.buspassengerRepository.findOne({
        where: { EMPNO: dto.EMPNO, STATENO: dto.STATENO },
      });
      if (data) {
        await this.buspassengerRepository.remove(data);
        return { deleted: true };
      }
      throw new NotFoundException(`Passenger with EMPNO ${dto.EMPNO} and STATENO ${dto.STATENO} is not found`);
  }

  async findAllWithRelations_bk(busId: number) {    
    return this.buspassengerRepository.find({
      //relations: ['Amecuserall', "stop", "stop.routed", "stop.routed.busmaster"]
      relations: ['stop', 'stop.routes','stop.routes.busmaster', 'Amecuserall' ]
    });
  }

  async findAllWithRelations(busId: number) {
    return this.buspassengerRepository
      .createQueryBuilder('bp')
      .leftJoinAndSelect('bp.stop', 'stop')
      .leftJoinAndSelect('stop.routes', 'route')
      .leftJoinAndSelect('route.busmaster', 'line')
      .leftJoinAndSelect('bp.Amecuserall', 'user')
      //.where('route.BUSLINE = :busId', { busId })
      .getMany();
  }

  async getAllTransport() {
    return this.userRepo
      .createQueryBuilder('u')
      .leftJoin('u.BUSPASSENGER', 'bp')
      .leftJoin('bp.stop', 'stop')
      .leftJoin('stop.routes', 'route')
      .leftJoin('route.busmaster', 'line')
      .where('u.CSTATUS = :status', { status: '1' })
      .andWhere('u.SEMPNO NOT LIKE :m', { m: 'M%' })
      .andWhere('u.SEMPNO NOT IN (:...exclude)', { exclude: ['SYSTEM','USRCONL','USRCONT','V25001','AS400']})
      .select([ 'u.SEMPNO','u.STNAME','u.SSEC', 'u.SDEPT','u.SDIV', 'line.BUSNAME AS BUSNAME','stop.STOP_NAME AS STOP_NAME', 'stop.WORKDAY_TIMEIN AS TIMEIN'])
      .orderBy('u.SEMPNO')
      .getRawMany();
  }


}
