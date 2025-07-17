import { Agent } from './entities/agent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent, 'amecConnection')
    private readonly agentRepository: Repository<Agent>,
  ) {}
}
