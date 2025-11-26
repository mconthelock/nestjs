import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { F110kpService } from './f110kp.service';
import { F110KP } from './entities/f110kp.entity';
import { F110kpController } from './f110kp.controller';

@Module({
  imports: [TypeOrmModule.forFeature([F110KP], 'amecConnection')],
  controllers: [F110kpController],
  providers: [F110kpService],
})
export class F110kpModule {}
