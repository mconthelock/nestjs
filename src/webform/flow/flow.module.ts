import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowService } from './flow.service';
import { FlowController } from './flow.controller';
import { Flow } from './entities/flow.entity';
import { Flowts } from './entities/flowts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flow, Flowts], 'amecConnection')],
  controllers: [FlowController],
  providers: [FlowService],
})
export class FlowModule {}
