import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { UniformService } from './uniform.service';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';

import { CreateUniformDto } from './dto/create-uniform.dto';
import { UpdateUniformDto } from './dto/update-uniform.dto';
import { CreateAnnualDto } from './dto/create-annual.dto';

@Controller('gpreport/uniform')
export class UniformController {
    constructor(private readonly uniform: UniformService) {}

    @Get('master')
    findAll() {
        return this.uniform.findAll();
    }

    @Get('rights')
    findRights() {
        return this.uniform.findRights();
    }

    @Get('annual/request/:userId/:year')
    findRightsByUserId(
        @Param('userId') userId: string,
        @Param('year') year: number,
    ) {
        return this.uniform.findAnnualRequest(userId, +year);
    }

    @Post('annual/request/')
    @UseTransaction('gpreportConnection')
    createRequest(@Body() data: CreateAnnualDto) {
        return this.uniform.createAnnualRequest(data);
    }

    @Delete('annual/request/:userId/:year')
    @UseTransaction('gpreportConnection')
    deleteRequest(@Body() data: CreateAnnualDto) {
        return this.uniform.createAnnualRequest(data);
    }
}
