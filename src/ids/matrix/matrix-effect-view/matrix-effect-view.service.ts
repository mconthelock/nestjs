import { Injectable } from '@nestjs/common';
import { SearchMatrixEffectViewDto } from './dto/search-matrix-effect-view.dto';
import { MatrixEffectView } from './entities/matrix-effect-view.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MatrixEffectViewService {
  constructor(
    @InjectRepository(MatrixEffectView, 'idsConnection')
    private readonly mtxEftRepo: Repository<MatrixEffectView>,
    @InjectDataSource('idsConnection')
    private readonly dataSource: DataSource,
  ) {}

  async getEffect(dto: SearchMatrixEffectViewDto) {
    const where: any = {};

    if (dto.SECID) where.SECID = dto.SECID;
    if (dto.ITEMNO) where.ITEMNO = dto.ITEMNO;
    if (dto.TITLE) where.TITLE = dto.TITLE;

    return await this.mtxEftRepo.find({ where });
  }
}
