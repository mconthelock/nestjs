import { Injectable } from '@nestjs/common';
import { CreateFlowmstDto } from './dto/create-flowmst.dto';
import { UpdateFlowmstDto } from './dto/update-flowmst.dto';

@Injectable()
export class FlowmstService {
  create(createFlowmstDto: CreateFlowmstDto) {
    return 'This action adds a new flowmst';
  }

  findAll() {
    return `This action returns all flowmst`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flowmst`;
  }

  update(id: number, updateFlowmstDto: UpdateFlowmstDto) {
    return `This action updates a #${id} flowmst`;
  }

  remove(id: number) {
    return `This action removes a #${id} flowmst`;
  }
}
