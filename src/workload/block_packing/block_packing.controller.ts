import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { BlockPackingService } from './block_packing.service';
import { CreateBlockPackingDto } from './dto/create-block_packing.dto';
import { UpdateBlockPackingDto } from './dto/update-block_packing.dto';

@Controller('block-packing')
export class BlockPackingController {
    constructor(private readonly blockPackingService: BlockPackingService) {}

    @Get('trn-barcode')
    async getTRNBarcode() {
        return this.blockPackingService.getTRNBarcode();
    }

    @Post('order-main-combine')
    async getOrderMainCombine(
        @Body('order') order: string,
        @Body('block') block: string,
    ) {
        return this.blockPackingService.getOrderMainCombine(order, block);
    }
}
