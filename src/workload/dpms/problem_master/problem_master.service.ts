import { Injectable } from '@nestjs/common';
import { CreateProblemMasterDto } from './dto/create-problem_master.dto';
import { UpdateProblemMasterDto } from './dto/update-problem_master.dto';

@Injectable()
export class ProblemMasterService {
  create(createProblemMasterDto: CreateProblemMasterDto) {
    return 'This action adds a new problemMaster';
  }

  findAll() {
    return `This action returns all problemMaster`;
  }

  findOne(id: number) {
    return `This action returns a #${id} problemMaster`;
  }

  update(id: number, updateProblemMasterDto: UpdateProblemMasterDto) {
    return `This action updates a #${id} problemMaster`;
  }

  remove(id: number) {
    return `This action removes a #${id} problemMaster`;
  }
}
