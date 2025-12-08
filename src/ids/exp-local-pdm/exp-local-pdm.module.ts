import { Module } from '@nestjs/common';
import { ExpLocalPdmService } from './exp-local-pdm.service';
import { ExpLocalPdmController } from './exp-local-pdm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ExpLocalPdmController],
  providers: [ExpLocalPdmService],
  exports: [ExpLocalPdmService],
})
export class ExpLocalPdmModule {}
