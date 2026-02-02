import { Module } from '@nestjs/common';
import { PpoService } from './ppo.service';
import { PpoController } from './ppo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPO } from 'src/common/Entities/amec/table/PPO.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PPO], 'webformConnection')],
  controllers: [PpoController],
  providers: [PpoService],
  exports: [PpoService],
})
export class PpoModule {}
