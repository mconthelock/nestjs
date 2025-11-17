import { Module } from '@nestjs/common';
import { FlowmstService } from './flowmst.service';
import { FlowmstController } from './flowmst.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flowmst } from './entities/flowmst.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flowmst], 'webformConnection')],
  controllers: [FlowmstController],
  providers: [FlowmstService],
  exports: [FlowmstService],
})
export class FlowmstModule {}
