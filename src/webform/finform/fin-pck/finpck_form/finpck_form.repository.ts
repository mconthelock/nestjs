import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { FINPCK_FORM } from 'src/common/Entities/webform/table/FINPCK_FORM.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto} from 'src/webform/form/dto/form.dto';
import { DataSource } from 'typeorm';
import { CreateFinpckFormDto } from './dto/create-finpck_form.dto';
@Injectable()
export class FinpckFormRepository extends BaseRepository {
    
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); 
    }
    async createForm(dto: CreateFinpckFormDto){
        return await this.getRepository(FINPCK_FORM).save(dto);
    }
}