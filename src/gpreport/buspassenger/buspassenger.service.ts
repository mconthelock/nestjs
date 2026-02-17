import { Buspassenger } from './entities/buspassenger.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBuspassengerDto } from './dto/create-buspassenger.dto';
import { UpdateBuspassengerDto } from './dto/update-buspassenger.dto';

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
    return this.buspassengerRepository.save(dto);
  }
  
  async update(dto: UpdateBuspassengerDto) {
    const data = await this.buspassengerRepository.findOne({
      where: { EMPNO: dto.EMPNO, STATENO: dto.STATENO },
    });
    if (data) {
      Object.assign(data, dto);
      data.UPDATE_DATE = new Date();
      await this.buspassengerRepository.save(data)
      return await this.buspassengerRepository.findOne({
        where: { EMPNO: dto.EMPNO, STATENO : dto.STATENO },
      });
    }
    throw new NotFoundException(`Passenger is not found`);
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

  async findByLine(busId: number) {
    return this.dataSource.query(
      `
        SELECT r.BUSLINE, s.STOP_ID, s.STOP_NAME, s.WORKDAY_TIMEIN, s.NIGHT_TIMEIN,
              s.HOLIDAY_TIMEIN, p.STATENO, r.IS_START,
              e.SEMPNO, e.SNAME, e.STNAME, e.SSEC, e.SDEPT, e.SDIV 
        FROM GPREPORT.BUS_ROUTE r
        INNER JOIN GPREPORT.BUS_STOP s 
            ON r.STOPNO = s.STOP_ID 
            AND s.STOP_STATUS = '1'
        LEFT JOIN GPREPORT.BUS_PASSENGER p 
            ON p.BUSSTOP = r.STOPNO 
            AND p.STATENO = r.STATENO
        LEFT JOIN AMEC.AMECUSERALL e 
            ON e.SEMPNO = p.EMPNO 
            AND e.CSTATUS = '1'
        WHERE r.BUSLINE = :1
        `,
      [busId],  
    );
  }
}
