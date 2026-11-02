import { Body, Controller, Get, Post } from '@nestjs/common';
import { RevService } from '../services/rev.service';

@Controller('safety/chemical/rev')
export class RevController {
    constructor(private readonly service: RevService) {}

    @Get()
    findAll() {
        return this.service.find('all');
    }

    @Get('active')
    findActive() {
        return this.service.find('active');
    }

    @Get('inactive')
    findInactive() {
        return this.service.find('inactive');
    }
}
