import { Injectable } from '@nestjs/common';
import { CreateSpecialuserDto } from './dto/create-specialuser.dto';
import { UpdateSpecialuserDto } from './dto/update-specialuser.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Specialuser } from './entities/specialuser.entity';

@Injectable()
export class SpecialuserService {
  constructor(
    @InjectRepository(Specialuser, 'auditConnection')
    private readonly spuRepo: Repository<Specialuser>,
    @InjectDataSource('auditConnection')
    private dataSource: DataSource,
  ) {}

  async getServerName() {
    const query = this.spuRepo.createQueryBuilder('spu');
    query.select('RTRIM(LTRIM(SERVER_NAME)) AS SERVER_NAME');
    query.distinct(true);
    return query.getRawMany();
  }

  async getUserLogin() {
    return this.spuRepo.find({
        where: {
            AUTH_CLASS: 'General',
            USER_TYPE1: 'Temporary',
            USER_TYPE2: 'Human',
            ACTIVE_STATUS: 1
        }
    });
  }

  async getController() {
    return this.spuRepo.find({
        where: {
            AUTH_CLASS: 'Almighty',
            USER_TYPE2: 'Human',
            ACTIVE_STATUS: 1
        }
    });
  }
}
