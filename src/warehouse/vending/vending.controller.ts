import { Controller, Get, Post, Body, Param, Query, Delete } from '@nestjs/common';
import { VendingService } from './vending.service';
import { CreateVendingDto } from './dto/create-vending.dto';
import { UpdateVendingDto } from './dto/update-vending.dto';
import { AddToolsVendingDto } from './dto/addtools-vending.dto';
import { CreateImportDto } from './dto/import-vending.dto';

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

    @Post('importVending')
    importVending(@Body() dto: CreateImportDto) {
        return this.vendingService.importVending(dto);
    }

    @Get('importHistory')
    importHistory() {
        return this.vendingService.importHistory();
    }

    // @Get('getImportDetail')
    @Get('getImportDetail/:importId')
    getImportDetail(
        @Param('importId') importId: number,
        // @Query('import_id') queryImportId?: number,
    ) {
        return this.vendingService.getImportDetail(importId);
    }

    @Delete('deleteImport/:importId')
    deleteImport(@Param('importId') importId: number) {
        return this.vendingService.deleteImport(importId);
    }
}
