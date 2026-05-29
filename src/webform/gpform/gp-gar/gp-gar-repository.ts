import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { GPGAR_CATEGORY } from "src/common/Entities/webform/table/GPGAR_CATEGORY.entity";
import { GPGAR_FORM } from "src/common/Entities/webform/table/GPGAR_FORM.entity";
import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/common/repositories/base-repository";
import { FormDto } from "src/webform/form/dto/form.dto";

@Injectable()
export class GpGarRepository extends BaseRepository{
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
    ){
        super(ds);
    }

    findAll(){
        return this.manager.find(GPGAR_CATEGORY);
    }

    async findOne(dto: FormDto){
        return this.getRepository(GPGAR_FORM).findOneBy(dto);
    }

    async CreateGpGarDto(dto){
        return this.getRepository(GPGAR_FORM).save(dto);
    }    



}