import { Module } from '@nestjs/common';
import { PvenderService } from './pvender.service';
import { PvenderController } from './pvender.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pvender } from '../../common/Entities/amec/table/PVENDER.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pvender], 'mitsuConnection')],
  controllers: [PvenderController],
  providers: [PvenderService],
  exports: [TypeOrmModule],
})
export class PvenderModule {}
