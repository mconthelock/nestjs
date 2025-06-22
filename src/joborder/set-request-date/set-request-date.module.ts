
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetRequestDateService } from './set-request-date.service';
import { SetRequestDateController } from './set-request-date.controller';
import { SetRequestDate } from './entities/set-request-date.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SetRequestDate], 'amecConnection')],
  controllers: [SetRequestDateController],
  providers: [SetRequestDateService],
})
export class SetRequestDateModule {}
