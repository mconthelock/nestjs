import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GpLy01Service } from './gp-ly01.service';
import { CreateGpLy01Dto } from './dto/create-gp-ly01.dto';
import { UpdateGpLy01Dto } from './dto/update-gp-ly01.dto';

@Controller('gpform/tax')
export class GpLy01Controller {
    constructor(private readonly tax: GpLy01Service) {}

    @Post()
    approve(@Body() data: CreateGpLy01Dto) {
        return this.tax.approve(data);
    }
}
