import { Controller, Get } from '@nestjs/common';
import { K850mpService } from './k850mp.service';

@Controller('datacenter/k850mp')
export class K850mpController {
    constructor(private readonly service: K850mpService) {}

    @Get()
    findAll() {
        return this.service.findAll();
    }
}
