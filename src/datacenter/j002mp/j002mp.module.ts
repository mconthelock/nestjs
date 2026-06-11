import { Module } from '@nestjs/common';
import { J002mpService } from './j002mp.service';
import { J002mpController } from './j002mp.controller';
import { J002mpRepository } from './j002mp.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { J002MP } from 'src/common/Entities/datacenter/table/J002MP.entity';

@Module({
  imports:[TypeOrmModule.forFeature([J002MP], 'datacenterConnection')],
  controllers: [J002mpController],
  providers: [J002mpService, J002mpRepository],
  exports: [J002mpService]
})
export class J002mpModule {}
