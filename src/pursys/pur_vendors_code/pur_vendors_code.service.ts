import { Injectable } from '@nestjs/common';
import { CreatePurVendorsCodeDto } from './dto/create-pur_vendors_code.dto';
import { UpdatePurVendorsCodeDto } from './dto/update-pur_vendors_code.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository  } from 'typeorm';
import { PurVendorsCode } from './entities/pur_vendors_code.entity';

@Injectable()
export class PurVendorsCodeService {
    constructor(
        @InjectRepository(PurVendorsCode, 'purConnection')
        private purVendorCodeRepo: Repository<PurVendorsCode>,
        @InjectDataSource('purConnection')
        private ds :DataSource,
    ) {}
  async create(createPurVendorsCodeDto: CreatePurVendorsCodeDto) {
      const newVendorCode = this.purVendorCodeRepo.create(createPurVendorsCodeDto);
    return await this.purVendorCodeRepo.save(newVendorCode);
  }

  async update(id: number, updatePurVendorsCodeDto: UpdatePurVendorsCodeDto) {
      const result = await this.purVendorCodeRepo.update(id, updatePurVendorsCodeDto);
      if (result.affected === 0) {
          throw new Error(`ไม่พบ Vendor code ID: ${id}`);
      }
  
    }

  async remove(id: number) {
        const result = await this.purVendorCodeRepo.delete(id);
    if (result.affected === 0) {
            throw new Error(`ไม่พบ Vendor ID: ${id} ให้ลบ`); 
        }
   
  }

  findAll() {
    return `This action returns all purVendorsCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purVendorsCode`;
  }



 
}
