import { Injectable } from '@nestjs/common';
import { CreateFxaGrpmstDto } from './dto/create-fxa_grpmst.dto';
import { UpdateFxaGrpmstDto } from './dto/update-fxa_grpmst.dto';
import { FXAGRPRepository} from './fxa_grpmst.repository';

@Injectable()
export class FxaGrpmstService {
    constructor(
      private readonly repo: FXAGRPRepository
  ) {}
  create(createFxaGrpmstDto: CreateFxaGrpmstDto) {
    return 'This action adds a new fxaGrpmst';
  }

  findAll() {
    return this.repo.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} fxaGrpmst`;
  }

  update(id: number, updateFxaGrpmstDto: UpdateFxaGrpmstDto) {
    return `This action updates a #${id} fxaGrpmst`;
  }

  remove(id: number) {
    return `This action removes a #${id} fxaGrpmst`;
  }
}
