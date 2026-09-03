import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { GPTPH_AREAS } from 'src/common/Entities/webform/table/GPTPH_AREAS.entity';
import { GPTPH_LOCATION } from 'src/common/Entities/webform/table/GPTPH_LOCATION.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';

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
}
