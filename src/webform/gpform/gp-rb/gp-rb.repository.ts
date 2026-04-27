import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { RB_PURPOSE } from "src/common/Entities/webform/table/GPRB_PURPOSE.entity";
import { BaseRepository } from "src/common/repositories/base-repository";
import { DataSource } from "typeorm";

@Injectable()
export class GpRbRepository  extends BaseRepository{
    constructor(
        @InjectDataSource('webformConnection') ds:DataSource,
    ){
            super(ds);
        }
    findAll(){
  return this.getRepository(RB_PURPOSE).find();
 }
}