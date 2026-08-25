import { Controller, Get, Param } from '@nestjs/common';
import { UniformService } from './uniform.service';

import { CreateUniformDto } from './dto/create-uniform.dto';
import { UpdateUniformDto } from './dto/update-uniform.dto';

@Controller('gpreport/uniform')
export class UniformController {
    constructor(private readonly unf: UniformService) {}

    @Get('master')
    findAll() {
        return this.unf.findAll();
    }

    @Get('rights')
    findRights() {
        return this.unf.findRights();
    }

    @Get('annual/request/:userId/:year')
    findRightsByUserId(
        @Param('userId') userId: string,
        @Param('year') year: string,
    ) {
        return this.unf.findAnnualRequest(userId, year);
    }
}
