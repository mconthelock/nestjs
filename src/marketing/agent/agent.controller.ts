import { Controller, Get } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller('mkt/agent')
export class AgentController {
  constructor(private readonly agent: AgentService) {}

  @Get()
  findAll() {
    return this.agent.findAll();
  }
}
