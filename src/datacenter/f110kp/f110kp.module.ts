import { Module } from '@nestjs/common';
import { F110kpService } from './f110kp.service';
import { F110kpController } from './f110kp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { F110KP } from 'src/common/Entities/datacenter/table/F110KP.entity';
import { F110kpRepository } from './f110kp.repository';

@Module({
  imports: [TypeOrmModule.forFeature([F110KP], 'datacenterConnection')],
  controllers: [F110kpController],
  providers: [F110kpService, F110kpRepository],
  exports: [F110kpService],
})
export class F110kpModule {}
