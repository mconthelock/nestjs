import { Injectable } from '@nestjs/common';
import { CreateMatrixSectionDto } from './dto/create-matrix-section.dto';
import { UpdateMatrixSectionDto } from './dto/update-matrix-section.dto';
import { MatrixSection } from './entities/matrix-section.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MatrixSectionService {
  constructor(
    @InjectRepository(MatrixSection, 'idsConnection')
    private readonly mtxSecRepo: Repository<MatrixSection>,
    @InjectDataSource('idsConnection')
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return await this.mtxSecRepo.find();
  }

  async findOne(id: number) {
    return await this.mtxSecRepo.findOneBy({ ID: id });
  }
}
