import { Controller, Get, Param, Post, Body, BadRequestException } from '@nestjs/common';
import { IimService } from './iim.service';

@Controller('datacenter/iim')
export class IimController {
    constructor(private readonly service: IimService) {}
    
    @Post('prod')
    findByProd(@Body('prod') prod: string | string[]) {
        if(!prod || (Array.isArray(prod) && prod.length === 0)) {
            throw new BadRequestException('Invalid prod value');
        }
        return this.service.findByProd(prod);
    }
}
