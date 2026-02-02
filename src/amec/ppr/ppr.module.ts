import { Module } from '@nestjs/common';
import { PprService } from './ppr.service';
import { PprController } from './ppr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPR } from 'src/common/Entities/amec/table/PPR.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PPR], 'webformConnection')],
  controllers: [PprController],
  providers: [PprService],
  exports: [PprService],
})
export class PprModule {}
