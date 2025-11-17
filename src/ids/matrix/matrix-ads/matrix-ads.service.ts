import { Injectable } from '@nestjs/common';
import { CreateMatrixAdDto } from './dto/create-matrix-ad.dto';
import { UpdateMatrixAdDto } from './dto/update-matrix-ad.dto';

@Injectable()
export class MatrixAdsService {
  create(createMatrixAdDto: CreateMatrixAdDto) {
    return 'This action adds a new matrixAd';
  }

  findAll() {
    return `This action returns all matrixAds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} matrixAd`;
  }

  update(id: number, updateMatrixAdDto: UpdateMatrixAdDto) {
    return `This action updates a #${id} matrixAd`;
  }

  remove(id: number) {
    return `This action removes a #${id} matrixAd`;
  }
}
