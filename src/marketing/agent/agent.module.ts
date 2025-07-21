import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentService } from './agent.service';
import { Agent } from './entities/agent.entity';
import { AgentController } from './agent.controller';

@Module({
  controllers: [AgentController],
  imports: [TypeOrmModule.forFeature([Agent], 'amecConnection')],
  providers: [AgentService],
})
export class AgentModule {}
