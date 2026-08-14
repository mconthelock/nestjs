import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ConectionService } from 'src/as400/conection/conection.service';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class MfgVtrRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        private readonly conn: ConectionService,
    ) {
        super(ds);
    }
}
