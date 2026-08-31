import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { GPTPH_AREAS } from 'src/common/Entities/webform/table/GPTPH_AREAS.entity';
import { GPTPH_LOCATION } from 'src/common/Entities/webform/table/GPTPH_LOCATION.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { CreateGpTphReqDto, CreateGpTphlistApplicantDto } from './dto/create-gp-tph.dto';
import { GPTPH_REQ_HEADER } from 'src/common/Entities/webform/table/GPTPH_REQ_HEADER.entity';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { GPTPH_APPLICANT } from 'src/common/Entities/webform/table/GPTPH_APPLICANT.entity';
import { GPTPH_AREA_RECORD } from 'src/common/Entities/webform/table/GPTPH_AREA_RECORD.entity';
@Injectable()
export class GpTphRepository extends BaseRepository {

    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }
    findAllAreas() {
        return this.getRepository(GPTPH_AREAS).find({
            relations: ['LOCATION']
        });
    }
    findAllLocations() {
        return this.getRepository(GPTPH_LOCATION).find({
            relations: ['AREAS']
        });
    }
        async findOne(dto: FormDto) {
            const qb = this.manager
                .createQueryBuilder(GPTPH_REQ_HEADER, 'req')
                .leftJoinAndSelect('req.form', 'form')
                .leftJoinAndSelect('req.formmaster', 'formmst')
                .where('req.NFRMNO = :NFRMNO', { NFRMNO: dto.NFRMNO })
                .andWhere('req.VORGNO = :VORGNO', { VORGNO: dto.VORGNO })
                .andWhere('req.CYEAR = :CYEAR', { CYEAR: dto.CYEAR })
                .andWhere('req.CYEAR2 = :CYEAR2', { CYEAR2: dto.CYEAR2 })
                .andWhere('req.NRUNNO = :NRUNNO', { NRUNNO: dto.NRUNNO });
            return qb.getOne();
        }

        async findList(dto: FormDto) {
            return this.manager
            .createQueryBuilder(GPTPH_APPLICANT, 'list')
                .where('list.CYEAR2 = :CYEAR2', { CYEAR2: dto.CYEAR2 })
                .andWhere('list.NRUNNO = :NRUNNO', { NRUNNO: dto.NRUNNO })
                .orderBy('list.SEQ_NO', 'ASC')
                .getMany();
        }

       /* async findOneWithList(dto: FormDto) {
            const form = await this.findOne(dto);
            const list = await this.findList(dto);
            return { 
                ...form, 
                DETAILS: list,
            };
        }*/
    
        async CreateGpTphReq(dto: CreateGpTphReqDto) {
            return this.getRepository(GPTPH_REQ_HEADER).save(dto)
        }
        
        async CreateGpTphApplicant(dto: CreateGpTphlistApplicantDto) {
            return this.getRepository(GPTPH_APPLICANT).save(dto)
        }

        async CreateGpTphArearecord(dto: GPTPH_AREA_RECORD) {
            return this.getRepository(GPTPH_AREA_RECORD).save(dto)
        }
}
