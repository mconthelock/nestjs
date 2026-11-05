import { Controller, Get, Param, Post, Body, BadRequestException } from '@nestjs/common';
import { IimService } from './iim.service';
import { FindByProdDto } from './iim.dto';

@Controller('datacenter/iim')
export class IimController {
    constructor(private readonly service: IimService) {}
    
    @Post('prod')
    findByProd(@Body() dto: FindByProdDto) {
        return this.service.findByProd(dto.IPROD);
    }
}
