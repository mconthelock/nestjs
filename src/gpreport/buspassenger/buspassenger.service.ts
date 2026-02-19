import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBuspassengerDto } from './dto/create-buspassenger.dto';
import { UpdateBuspassengerDto } from './dto/update-buspassenger.dto';
import { Buspassenger } from 'src/common/Entities/gpreport/table/buspassenger.entity';

@Injectable()
export class BuspassengerService {
  constructor(
    @InjectRepository(Buspassenger, 'gpreportConnection')
    private readonly buspassengerRepository: Repository<Buspassenger>,
    @InjectDataSource('gpreportConnection')
    private readonly dataSource: DataSource,
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

  async findAllWithRelations(busId: number) {    
    return this.buspassengerRepository.find({
      relations: ['Amecuserall', "stop", "stop.routed", "stop.routed.busmaster"]
    });
  }
}
