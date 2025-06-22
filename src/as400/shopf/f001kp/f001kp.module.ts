import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { F001kpService } from './f001kp.service';
import { F001kpController } from './f001kp.controller';
import { F001KP } from './entities/f001kp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([F001KP], 'amecConnection')],
  controllers: [F001kpController],
  providers: [F001kpService],
})
export class F001kpModule {}
