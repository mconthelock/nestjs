import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Q141kpService } from './q141kp.service';
import { Q141kp } from './entities/q141kp.entity';
import { Q141kpController } from './q141kp.controller';

@Module({
  controllers: [Q141kpController],
  imports: [
    TypeOrmModule.forFeature([Q141kp], 'amecConnection')
  ],
  providers: [Q141kpService],
})
export class Q141kpModule {}
