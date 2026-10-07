import { Injectable } from '@nestjs/common';
import { CreatePurevaScoreDto } from './dto/create-pureva_score.dto';
import { UpdatePurevaScoreDto } from './dto/update-pureva_score.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PurevaScoreRepository } from './pureva_score.repository';
import { RequestPurevaScoreDto } from './dto/request-pureva_score.dto';


@Injectable()
export class PurevaScoreService {
 constructor(private readonly repo: PurevaScoreRepository) {}

async createMultipleScores(formDto:FormDto , scores:RequestPurevaScoreDto[]) {
      try {
            const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO } = formDto;
            const currentMaxId = await this.repo.getMaxId(
            NFRMNO, 
            VORGNO, 
            CYEAR, 
            CYEAR2, 
            NRUNNO
            );
            let runningId = currentMaxId;
                // 3. วนลูปสร้างข้อมูล
            const  scoresToInsert = scores.map((item) => {
              runningId += 1; // รันเลข ID ต่อจากค่า Max
              
              return {
                // ใช้ค่าจาก FormDto เป็นหัวขบวน
                ...formDto,
                ...item,
                EVAID: runningId, 
              };
            });


            const res = await this.repo.InsertScores(scoresToInsert);
            if(!res){
                throw new Error('Failed to insert PUREVASCORE');
            }
            return {
                status: true,
                message: 'Insert PUREVASCORE Successfully',
            };
        } catch (error) {
            throw new Error('Insert PUREVASCORE Error: ' + error.message);
        }
  }

 async create(dto: CreatePurevaScoreDto) {
      try {
            const res = await this.repo.create(dto);
            if(!res){
                throw new Error('Failed to insert PUREVASCORE');
            }
            return {
                status: true,
                message: 'Insert PUREVASCORE Successfully',
            };
        } catch (error) {
            throw new Error('Insert PUREVASCORE Error: ' + error.message);
        }
  }

async deleteByAll(dto: FormDto) {
    try {
        const res = await this.repo.deleteByAll(dto);       
        if(!res){
                throw new Error('Failed to Delete PUREVASCORE');
            }
            return {
                status: true,
                message: 'Delete PUREVASCORE Successfully',
            };
        } catch (error) {
            throw new Error('Delete PUREVASCORE Error: ' + error.message);
        }
  }

  findAll() {
    return `This action returns all PUREVASCORE`;
  }

  findOne(id: number) {
    return `This action returns a #${id} PUREVASCORE`;
  }

  update(id: number, updatePurevaFormDto: UpdatePurevaScoreDto) {
    return `This action updates a #${id} PUREVASCORE`;
  }

  remove(id: number) {
    return `This action removes a #${id} PUREVASCORE`;
  }
}
