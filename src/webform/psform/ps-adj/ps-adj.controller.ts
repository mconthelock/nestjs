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
    constructor(private readonly service: PsAdjService) {}
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
    @Post('orders')
    createOrder(@Body() dto: CreateOrderDto) {
        return this.service.createOrder(dto);
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
    @Post('files')
    createFile(@Body() dto: CreateFileDto) {
        return this.service.createFile(dto);
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
