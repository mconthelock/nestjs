import { Injectable } from '@nestjs/common';
import { CreatePappflowDto } from './dto/create-pappflow.dto';
import { UpdatePappflowDto } from './dto/update-pappflow.dto';
import { PAPPFLOW } from 'src/common/Entities/amec/table/PAPPFLOW.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository , Like } from 'typeorm';



@Injectable()
export class PappflowService {
constructor(
        @InjectRepository(PAPPFLOW, 'webformConnection')
        private readonly pappFlowRepository: Repository<PAPPFLOW>,
    ) {}
  create(createPappflowDto: CreatePappflowDto) {
    return 'This action adds a new pappflow';
  }

  findAll() {
    return `This action returns all pappflow`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pappflow`;
  }

  async findFlowWithSteps(sLevelParam: string, nStepParam: number): Promise<PAPPFLOW[]> {
        return await this.pappFlowRepository.find({
            relations: {
                STEPS: true,
            },
            where: {
                SLEVEL: Like(`%${sLevelParam}%`),
                STEPS: {
                    NSTEP: nStepParam,
                },
            },
        });
  }

  update(id: number, updatePappflowDto: UpdatePappflowDto) {
    return `This action updates a #${id} pappflow`;
  }

  remove(id: number) {
    return `This action removes a #${id} pappflow`;
  }
}
