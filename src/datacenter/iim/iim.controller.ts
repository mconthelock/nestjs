import { Controller, Get, Param, Post, Body, BadRequestException } from '@nestjs/common';
import { IimService } from './iim.service';
import type { FindByProdDto } from './iim.dto';

@Controller('datacenter/iim')
export class IimController {
    constructor(private readonly service: IimService) {}
    
    @Post('prod')
    findByProd(@Body() dto: FindByProdDto) {
         console.log(dto);
    console.log(typeof dto);
    console.log(dto.IPROD);
    console.log(typeof dto.IPROD);
    
    return {
        dto,
        type: typeof dto,
        iprod: dto.IPROD,
        iprodType: typeof dto.IPROD,
    };
        return dto;
        // return this.service.findByProd(dto.IPROD);
    }
}
