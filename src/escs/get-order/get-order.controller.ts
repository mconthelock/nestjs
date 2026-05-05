import { Controller, Post, Body } from '@nestjs/common';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetOrderService } from './get-order.service';
import { GetOrderDto } from './dto/get-order.dto';
import { GetOrderResponseDto } from './dto/get-order-response.dto';

@ApiTags('ESCS Get Order')
@Controller('escs/get-order')
export class GetOrderController {
    constructor(private readonly service : GetOrderService) {}

    @Post('order')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get order data' })
    @ApiResponse({ status: 200, type: GetOrderResponseDto })
    async getOrder(@Body() dto: GetOrderDto): Promise<GetOrderResponseDto | null> {
        return this.service.getOrder(dto);
    }
}

