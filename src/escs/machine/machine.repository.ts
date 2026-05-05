import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { SearchMachineDto } from './dto/search-machine.dto';
import { MACHINE_NAME } from 'src/common/Entities/escs/table/MACHINE_NAME.entity';

@Injectable()
export class MachineRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection')
        ds: DataSource,
    ) {
        super(ds);
    }

    findMachine(dto: SearchMachineDto) {
        return this.getRepository(MACHINE_NAME).findOne({
            where: {
                MC_TYPE: dto.mcType,
                MC_NO: dto.mcNo
            },
        });
    }

    findByName(name: string) {
        return this.getRepository(MACHINE_NAME).findOne({
            where: {
                MC_NAME: name
            },
        });
    }
}