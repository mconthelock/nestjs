import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ATTCNFRM } from 'src/common/Entities/webform/table/ATTCNFRM.entity';
import { CreateAttcnfrmDto } from './dto/create-attcnfrm.dto';
import { SearchAttCNFileDto } from './dto/search-attcnfrm.dto';

@Injectable()
export class AttCnFrmRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getQaFileByID(dto: SearchAttCNFileDto) {
        return this.getRepository(ATTCNFRM).findOne({
            where: {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
                TYPENO: dto.TYPENO,
            },
            order: {
                ITEMNO: 'ASC',
            },
        });
    }

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 38e4fc7c (QA-CN)
=======
>>>>>>> 38e4fc7c (QA-CN)
    async getQaFileAll(dto: SearchAttCNFileDto) {
        return this.getRepository(ATTCNFRM).find({
            where: {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
                TYPENO: dto.TYPENO,
            },
            order: {
                ITEMNO: 'ASC',
            },
        });
    }

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 67c79348 (PUR-EVA)
=======
>>>>>>> 38e4fc7c (QA-CN)
=======
>>>>>>> 67c79348 (PUR-EVA)
=======
>>>>>>> 38e4fc7c (QA-CN)
    async getNextSeq(dto: SearchAttCNFileDto) {
        return this.getRepository(ATTCNFRM).find({
            where: dto,
            order: {
                ITEMNO: 'DESC',
            },
            take: 1,
        });
    }

    async insert(dto: CreateAttcnfrmDto) {
        return this.getRepository(ATTCNFRM).insert(dto);
    }

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    async deleteAll(dto: SearchAttCNFileDto) {
=======
    async delete(dto: SearchAttCNFileDto) {
>>>>>>> 67c79348 (PUR-EVA)
=======
    async deleteAll(dto: SearchAttCNFileDto) {
>>>>>>> 38e4fc7c (QA-CN)
=======
    async delete(dto: SearchAttCNFileDto) {
>>>>>>> 67c79348 (PUR-EVA)
=======
    async deleteAll(dto: SearchAttCNFileDto) {
>>>>>>> 38e4fc7c (QA-CN)
        return this.getRepository(ATTCNFRM).delete(dto);
    }
}
