import { Injectable } from '@nestjs/common';
import { CreatePurevaVendorRelationDto } from './dto/create-pureva_vendor_relation.dto';
import { UpdatePurevaVendorRelationDto } from './dto/update-pureva_vendor_relation.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PurevaRelationRepository } from './pureva_vendor_relation.repository';
import { RequestPurevaVendorRelationDto } from './dto/request-pureva_vendor_relation.dto';

@Injectable()
export class PurevaVendorRelationService {
 constructor(private readonly repo: PurevaRelationRepository) {}

async createMultipleRelations(formDto:FormDto , relations:RequestPurevaVendorRelationDto[]) {
      try {
            const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO } = formDto;
            const typeentity = relations[0].ENTITY_TYPE;
            const currentMaxId = await this.repo.getMaxId(
            NFRMNO, 
            VORGNO, 
            CYEAR, 
            CYEAR2, 
            NRUNNO,
            typeentity
            );
            let runningId = currentMaxId;
                // 3. วนลูปสร้างข้อมูล
            const  relationToInsert = relations.map((item) => {
              runningId += 1; // รันเลข ID ต่อจากค่า Max
              
              return {
                // ใช้ค่าจาก FormDto เป็นหัวขบวน
                ...formDto,
                ...item,
                ID: runningId, 
              };
            });


            const res = await this.repo.InsertRelations(relationToInsert);
            if(!res){
                throw new Error('Failed to insert PUREVAVENDORRELATION');
            }
            return {
                status: true,
                message: 'Insert PUREVAVENDORRELATION Successfully',
            };
        } catch (error) {
            throw new Error('Insert PUREVAVENDORRELATION Error: ' + error.message);
        }
  }

 async create(dto: CreatePurevaVendorRelationDto) {
      try {
            const res = await this.repo.create(dto);
            if(!res){
                throw new Error('Failed to insert PUREVAVENDORRELATION');
            }
            return {
                status: true,
                message: 'Insert PUREVAVENDORRELATION Successfully',
            };
        } catch (error) {
            throw new Error('Insert PUREVAVENDORRELATION Error: ' + error.message);
        }
  }

  findAll() {
    return `This action returns all PUREVAVENDORRELATION`;
  }

  findOne(id: number) {
    return `This action returns a #${id} PUREVAVENDORRELATION`;
  }

  update(id: number, updatePurevaRelationDto: UpdatePurevaVendorRelationDto) {
    return `This action updates a #${id} PUREVAVENDORRELATION`;
  }

  remove(id: number) {
    return `This action removes a #${id} PUREVAVENDORRELATION`;
  }
}
