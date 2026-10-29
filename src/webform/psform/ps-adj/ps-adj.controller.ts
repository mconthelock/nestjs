import { Req } from '@nestjs/common';
import { Request } from 'express';
import { getClientIP } from 'src/common/utils/ip.utils';
import { PsAdjAutoService } from './ps-adj-auto.service';
import { AutoInsertAdjustDto } from './dto/auto-insert-adjust.dto';
import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { PsAdjService } from './ps-adj.service';
import {
    ReasonKeyDto,
    CreateReasonDto,
    UpdateReasonDto,
    FindReasonDto,
    OrderKeyDto,
    CreateOrderDto,
    UpdateOrderDto,
    FindOrderDto,
    FileKeyDto,
    CreateFileDto,
    UpdateFileDto,
    FindFileDto,
} from './dto/ps-adj.dto';

@Controller('ps-adj')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class PsAdjController {
    constructor(private readonly service: PsAdjService, private readonly auto: PsAdjAutoService) {}
    @Post('reasons')
    createReason(@Body() dto: CreateReasonDto) {
        return this.service.createReason(dto);
    }
    @Get('reasons')
    findReason(@Query() key: FindReasonDto) {
        return this.service.findReason(key);
    }
    @Patch('reasons')
    updateReason(@Query() key: ReasonKeyDto, @Body() dto: UpdateReasonDto) {
        return this.service.updateReason(key, dto);
    }
    @Delete('reasons')
    deleteReason(@Query() key: ReasonKeyDto) {
        return this.service.deleteReason(key);
    }
    @Post('auto_insert_adjust')
    auto_insert_adjust(@Body() dto: AutoInsertAdjustDto, @Req() req: Request) {
        return this.auto.auto_insert_adjust(dto, getClientIP(req));
    }
    @Post('insert_adjust')
    insert_adjust(@Body() dto: CreateOrderDto) {
        return this.service.insert_adjust(dto);
    }
    @Get('orders')
    findOrder(@Query() key: FindOrderDto) {
        return this.service.findOrder(key);
    }
    @Patch('orders')
    updateOrder(@Query() key: OrderKeyDto, @Body() dto: UpdateOrderDto) {
        return this.service.updateOrder(key, dto);
    }
    @Delete('orders')
    deleteOrder(@Query() key: OrderKeyDto) {
        return this.service.deleteOrder(key);
    }
    @Post('insert_files_adjust')
    insert_files_adjust(@Body() dto: CreateFileDto) {
        return this.service.insert_files_adjust(dto);
    }
    @Get('files')
    findFile(@Query() key: FindFileDto) {
        return this.service.findFile(key);
    }
    @Patch('files')
    updateFile(@Query() key: FileKeyDto, @Body() dto: UpdateFileDto) {
        return this.service.updateFile(key, dto);
    }
    @Delete('files')
    deleteFile(@Query() key: FileKeyDto) {
        return this.service.deleteFile(key);
    }
}
