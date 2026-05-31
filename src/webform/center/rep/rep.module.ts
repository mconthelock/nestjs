import { Module } from '@nestjs/common';
import { RepService } from './rep.service';
import { RepController } from './rep.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { REP } from 'src/common/Entities/webform/table/REP.entity';
import { RepRepository } from './rep.repository';

@Module({
    imports: [TypeOrmModule.forFeature([REP], 'webformConnection')],
    controllers: [RepController],
    providers: [RepService, RepRepository],
    exports: [RepService],
})
export class RepModule {}
