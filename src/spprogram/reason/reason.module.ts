import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReasonService } from './reason.service';
import { ReasonController } from './reason.controller';
import { Reason } from './entities/reason.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reason], 'spsysConnection')],
  controllers: [ReasonController],
  providers: [ReasonService],
})
export class ReasonModule {}
