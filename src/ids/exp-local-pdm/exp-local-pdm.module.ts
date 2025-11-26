import { Module } from '@nestjs/common';
import { ExpLocalPdmService } from './exp-local-pdm.service';
import { ExpLocalPdmController } from './exp-local-pdm.controller';
import { ExpLocalPdm } from './entities/exp-local-pdm.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ExpLocalPdm], 'pdmConnection')],
  controllers: [ExpLocalPdmController],
  providers: [ExpLocalPdmService],
  exports: [ExpLocalPdmService],
})
export class ExpLocalPdmModule {}
