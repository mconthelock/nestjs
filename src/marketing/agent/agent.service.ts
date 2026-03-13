import { Agent } from './entities/agent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AgentService {
    constructor(
        @InjectRepository(Agent, 'datacenterConnection')
        private readonly agent: Repository<Agent>,
    ) {}

    findAll() {
        return this.agent.find({
            relations: { country: true },
            order: { AGENT: 'ASC', country: { CTNAME: 'ASC' } },
        });
    }
}
