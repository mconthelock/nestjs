import { Injectable } from '@nestjs/common';
import { CreatePurevaProfitTurnoverDto } from './dto/create-pureva_profit_turnover.dto';
import { UpdatePurevaProfitTurnoverDto } from './dto/update-pureva_profit_turnover.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PurevaProfitTurnoverRepository } from './pureva_profit_turnover.repository'; 
import { RequestPurevaProfitTurnoverDto } from './dto/request-pureva_profit_turnover.dto';


@Injectable()
export class PurevaProfitTurnoverService {
 constructor(private readonly repo: PurevaProfitTurnoverRepository) {}
 async createMultipleProfits(formDto:FormDto , profits:RequestPurevaProfitTurnoverDto[]) {
      try {
            const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO } = formDto;
            const RECORD_TYPE = profits[0].RECORD_TYPE;
            const currentMaxId = await this.repo.getMaxId(
            NFRMNO, 
            VORGNO, 
            CYEAR, 
            CYEAR2, 
            NRUNNO,
            RECORD_TYPE
            );
            let runningId = currentMaxId;
                // 3. วนลูปสร้างข้อมูล
            const  profitsToInsert = profits.map((item) => {
              runningId += 1; // รันเลข ID ต่อจากค่า Max
              
              return {
                // ใช้ค่าจาก FormDto เป็นหัวขบวน
                ...formDto,
                ...item,
                ID: runningId, 
              };
            });


            const res = await this.repo.InsertProfits(profitsToInsert);
            if(!res){
                throw new Error('Failed to insert PUREVAPROFITTURNOVER');
            }
            return {
                status: true,
                message: 'Insert PUREVAPROFITTURNOVER Successfully',
            };
        } catch (error) {
            throw new Error('Insert PUREVAPROFITTURNOVER Error: ' + error.message);
        }
  }

  create(createPurevaProfitTurnoverDto: CreatePurevaProfitTurnoverDto) {
      return 'This action adds a new finpckAsset';
  }

  findAll() {
    return `This action returns all PUREVAPROFITTURNOVER`;
  }

  findOne(id: number) {
    return `This action returns a #${id} PUREVAPROFITTURNOVER`;
  }

  update(id: number, updatePurevaFormDto: UpdatePurevaProfitTurnoverDto) {
    return `This action updates a #${id} PUREVAPROFITTURNOVER`;
  }

  remove(id: number) {
    return `This action removes a #${id} PUREVAPROFITTURNOVER`;
  }
}
