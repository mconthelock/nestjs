import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowService } from './flow.service';
import { FlowController } from './flow.controller';
import { Flow } from './entities/flow.entity';
import { RepModule } from '../rep/rep.module';

@Module({
  imports: [TypeOrmModule.forFeature([Flow], 'amecConnection'), RepModule],
  controllers: [FlowController],
  providers: [FlowService],
  exports: [FlowService],
})
export class FlowModule {}
