import { Body, Controller, Get, Patch, Post, Param } from '@nestjs/common';
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

    @Patch('master/:revision')
    update(@Param('revision') revision: string) {
        return this.service.updateRevisionMaster(revision);
    }
}
