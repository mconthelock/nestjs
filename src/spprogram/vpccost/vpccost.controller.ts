import { Controller, Get, Post, Body } from '@nestjs/common';
import { VpccostService } from './vpccost.service';
import { CreateVpccostDto } from './dto/create-vpccost.dto';
import { UpdateVpccostDto } from './dto/update-vpccost.dto';

@Controller('sp/vpccost')
export class VpccostController {
    constructor(private readonly vpccostService: VpccostService) {}

    @Get()
    findAll() {
        return this.vpccostService.findAll();
    }
}
