import { Injectable } from '@nestjs/common';
import { CreateMatrixAdDto } from './dto/create-matrix-ad.dto';
import { UpdateMatrixAdDto } from './dto/update-matrix-ad.dto';
import { MatrixAd } from './entities/matrix-ad.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MatrixAdsService {
  constructor(
    @InjectRepository(MatrixAd, 'idsConnection')
    private matrixAdRepository: Repository<MatrixAd>,
    @InjectDataSource('idsConnection')
    private readonly dataSource: DataSource,
  ) {}

  create(createMatrixAdDto: CreateMatrixAdDto) {
    return this.matrixAdRepository.save(createMatrixAdDto);
  }

  findAll() {
    return this.matrixAdRepository.find();
  }

  findOne(id: number) {
    return this.matrixAdRepository.findOneBy({ ID: id });
  }

  remove(id: number) {
    return this.matrixAdRepository.delete({ ID: id });
  }
}
