import { Injectable } from '@nestjs/common';
import { CreatePurVendorDto } from './dto/create-pur_vendor.dto';
import { UpdatePurVendorDto } from './dto/update-pur_vendor.dto';
import { SearchPurVendorDto } from './dto/search-pur_vendor.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository , Brackets } from 'typeorm';
import { PurVendor } from './entities/pur_vendor.entity';


@Injectable()
export class PurVendorsService {
    constructor(
      @InjectRepository(PurVendor, 'purConnection')
      private purVendorRepo: Repository<PurVendor>,
      @InjectDataSource('purConnection')
      private ds :DataSource,
    ) {}
  async create(dto: CreatePurVendorDto) {
    const newVendor = this.purVendorRepo.create(dto);
    return await this.purVendorRepo.save(newVendor);
  }

    async search(searchDto: SearchPurVendorDto)
  {
    const {KEYWORD, STATUS, TYPE} = searchDto;
    const qb = this.purVendorRepo.createQueryBuilder('vendor')
    .leftJoinAndSelect('vendor.VENDOR_CODES', 'code')
    .leftJoinAndSelect('vendor.VENDOR_ADDRESS', 'address')
    .leftJoinAndSelect('vendor.VENDOR_ATTFILE', 'attfile');
 
    if (KEYWORD) {
      qb.andWhere(
        new Brackets((qbInner) => {
          qbInner.where('LOWER(vendor.VND_NAME) LIKE LOWER(:KEYWORD)', { KEYWORD: `%${KEYWORD}%` })
                 .orWhere('LOWER(vendor.VND_LONGNAME) LIKE LOWER(:KEYWORD)', { KEYWORD: `%${KEYWORD}%` });
          if (!isNaN(Number(KEYWORD))) {
            qbInner.orWhere('vendor.VND_ID = :id', { id: Number(KEYWORD) });
          }
        }),
      );
    }
    if (STATUS !== undefined) {
      qb.andWhere('vendor.VND_STATUS = :STATUS', { STATUS: STATUS });
    }
    if (TYPE !== undefined) {
      qb.andWhere('vendor.VND_TYPE = :TYPE', { TYPE: TYPE });
    }
    qb.orderBy('vendor.VND_LASTUPDATE', 'DESC');
    return await qb.getMany();
  }

  findAll() {
    return `This action returns all purVendors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purVendor`;
  }

  async update(id: number, updatePurVendorDto: UpdatePurVendorDto) {
    const result = await this.purVendorRepo.update(id, updatePurVendorDto);
    if (result.affected === 0) {
        throw new Error(`ไม่พบ Vendor ID: ${id}`);
    }

  }

 async remove(id: number) {
        const result = await this.purVendorRepo.delete(id);
    if (result.affected === 0) {
            throw new Error(`ไม่พบ Vendor ID: ${id} ให้ลบ`); 
        }
   
  }



}
