import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowService } from './flow.service';
import { FlowController } from './flow.controller';
import { Flow } from './entities/flow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flow], 'amecConnection')],
  controllers: [FlowController],
  providers: [FlowService],
})
export class FlowModule {}
