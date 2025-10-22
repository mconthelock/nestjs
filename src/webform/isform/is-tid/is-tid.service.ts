import { Injectable } from '@nestjs/common';
import { CreateIsTidDto } from './dto/create-is-tid.dto';
import { UpdateIsTidDto } from './dto/update-is-tid.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IsTid } from './entities/is-tid.entity';

@Injectable()
export class IsTidService {
  constructor(
    @InjectRepository(IsTid, 'webformConnection')
    private readonly istidRepo: Repository<IsTid>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
  ) {}
  
  async getFormData(dto: FormDto) {
    return this.istidRepo.findOne({
        where: dto
    });
  }
}
