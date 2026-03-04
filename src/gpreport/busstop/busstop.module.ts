import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusstopService } from './busstop.service';
import { Busstop } from '../../common/Entities/gpreport/table/busstop.entity';
import { BusstopController } from './busstop.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Busstop], 'gpreportConnection')],
  controllers: [BusstopController],
  providers: [BusstopService],
})
export class BusstopModule {}
