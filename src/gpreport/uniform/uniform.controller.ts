import { Controller, Get, Param } from '@nestjs/common';
import { UniformService } from './uniform.service';

import { CreateUniformDto } from './dto/create-uniform.dto';
import { UpdateUniformDto } from './dto/update-uniform.dto';

@Controller('gpreport/uniform')
export class UniformController {
    constructor(private readonly uniformService: UniformService) {}

    @Get('master')
    findAll() {
        return this.uniformService.findAll();
    }

    @Get('rights')
    findRights() {
        return this.uniformService.findRights();
    }

    @Get('annual/request/:userId/:year')
    findRightsByUserId(
        @Param('userId') userId: string,
        @Param('year') year: string,
    ) {
        //return this.uniformService.findRightsByUserId(userId, year);
    }
}
