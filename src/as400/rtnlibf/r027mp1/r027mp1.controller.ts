import { Controller, Get } from '@nestjs/common';
import { R027mp1Service } from './r027mp1.service';

@Controller('as400/rtnlibf/r027mp1')
export class R027mp1Controller {
    constructor(private readonly r027mp1Service: R027mp1Service) {}

    @Get()
    async findAll() {
        const result = await this.r027mp1Service.findAll({
            filters: [{ field: 'R27M13', op: 'eq', value: '20260316' }],
        });
        return result;
    }
}
