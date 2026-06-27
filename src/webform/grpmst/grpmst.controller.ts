import { Controller, Get } from '@nestjs/common';
import { GrpmstService } from './grpmst.service';

@Controller('webform/grpmst')
export class GrpmstController {
    constructor(private readonly grpmstService: GrpmstService) {}

    @Get()
    findAll() {
        return this.grpmstService.findAll();
    }
}
