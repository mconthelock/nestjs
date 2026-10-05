import { Controller } from '@nestjs/common';
import { PurPraService } from '../services/pur-pra.service';
import { Get } from '@nestjs/common';

@Controller('purform/pur-pra')
export class PurPraController {
    constructor(private readonly service: PurPraService) {}

    @Get('committees')
    getCommittees() {
        return this.service.getCommittees();
    }

    @Get('groups')
    getGroups() {
        return this.service.getGroups();
    }
}
