import { Module } from '@nestjs/common';
import { StyPatrolService } from './sty-patrol.service';
import { StyPatrolController } from './sty-patrol.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { STY_PATROL } from 'src/common/Entities/gpreport/table/STY_PATROL.entity';
import { StyPatrolRepository } from './sty-patrol.repository';

@Module({
    imports: [TypeOrmModule.forFeature([STY_PATROL], 'gpreportConnection')],
    controllers: [StyPatrolController],
    providers: [StyPatrolService, StyPatrolRepository],
    exports: [StyPatrolService],
})
export class StyPatrolModule {}
