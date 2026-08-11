import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MfgFeederService } from './mfg-feeder.service';
import { GetIdTagDto } from './dto/get-idtag.dto';
import { GetDrawingBmDto } from './dto/get-drawing-bm.dto';
import { MfgFeederResponseDto } from './dto/mfg-feeder-response.dto';
import { DrawingBMResponseDto } from './dto/drawing-bm-response.dto';

@ApiTags('ESCS MFG Feeder')
@Controller('escs/mfg-feeder')
export class MfgFeederController {
    constructor(
        private readonly service: MfgFeederService,
    ) {}

    @Get('info/:controlNo')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get feeder ID-Tag information by Control No.' })
    @ApiResponse({ status: 200, type: MfgFeederResponseDto })
    async getInfo(
        @Param() dto: GetIdTagDto,
    ): Promise<MfgFeederResponseDto> {
        return this.service.getInfo(
            dto.controlNo,
        );
    }

    @Get('drawing-bm')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get BM drawing count' })
    @ApiResponse({ status: 200, type: DrawingBMResponseDto })
    async getDrawingBM(
        @Query() dto: GetDrawingBmDto,
    ): Promise<DrawingBMResponseDto> {
        return this.service.getDrawingBMCount(dto);
    }
}