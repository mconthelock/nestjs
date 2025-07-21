import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailService } from './detail.service';
import { DetailController } from './detail.controller';
import { F001KP } from '../../as400/shopf/f001kp/entities/f001kp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([F001KP], 'amecConnection')],
  controllers: [DetailController],
  providers: [DetailService],
})
export class DetailModule {}
