import { Controller, Get, Post, Body } from '@nestjs/common';
import { VendingService } from './vending.service';
import { CreateVendingDto } from './dto/create-vending.dto';
import { UpdateVendingDto } from './dto/update-vending.dto';
import { AddToolsVendingDto } from './dto/addtools-vending.dto';

@Controller('vending')
export class VendingController {
    constructor(private readonly vendingService: VendingService) {}

    @Get('getProduct')
    getProduct() {
        return this.vendingService.getProduct();
    }

    @Post('addTools')
    addTools(@Body() dto: AddToolsVendingDto) {
        return this.vendingService.addTools(dto);
    }

    @Get('getTools')
    getTools() {
        return this.vendingService.getTools();
    }
}
