import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    Delete,
} from '@nestjs/common';
import { VendingService } from './vending.service';
import { CreateVendingDto } from './dto/create-vending.dto';
import { UpdateVendingDto } from './dto/update-vending.dto';
import { AddToolsVendingDto } from './dto/addtools-vending.dto';
import { CreateImportDto } from './dto/import-vending.dto';
import { VENDING_USER } from 'src/common/Entities/skid/table/VENDING_USER.entity';

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

    @Get('getUserVending')
    getUserVending() {
        return this.vendingService.getUserVending();
    }

    @Post('addUserVending')
    saveUserVending(
        @Body()
        {
            EMPNO,
            CREATED_BY,
        }: { EMPNO: string[]; CREATED_BY: string },
    ) {
        return this.vendingService.saveUserVending(EMPNO, CREATED_BY);
    }

    @Delete('users/:empno')
    deleteUserVending(
        @Param('empno') empno: string,
        @Body() { UPDATED_BY }: { UPDATED_BY: string },
    ) {
        return this.vendingService.deleteUserVending(empno, UPDATED_BY);
    }

    @Get('getToolWithdrawalWithRequest')
    getToolWithdrawalWithRequest() {
        return this.vendingService.getToolWithdrawalWithRequest();
    }
}
