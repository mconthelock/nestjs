import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RNCAUSE } from 'src/common/Entities/webform/table/RNCAUSE.entity';

import { RncauseController } from './rncause.controller';
import { RncauseRepository } from './rncause.repository';
import { RncauseService } from './rncause.service';

@Module({
    imports: [TypeOrmModule.forFeature([RNCAUSE], 'webformConnection')],
    controllers: [RncauseController],
    providers: [RncauseService, RncauseRepository],
    exports: [RncauseService],
})
export class RncauseModule {}