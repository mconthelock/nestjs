import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { F003kpService } from './f003kp.service';
import { F003kpController } from './f003kp.controller';
import { F003KP } from './entities/f003kp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([F003KP], 'amecConnection')],
  controllers: [F003kpController],
  providers: [F003kpService],
})
export class F003kpModule {}
