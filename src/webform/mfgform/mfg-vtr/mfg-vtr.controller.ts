import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
} from '@nestjs/common';
import { Request } from 'express';
import { MfgVtrService } from './mfg-vtr.service';
import { CreateMfgVtrDto } from './dto/create-mfg-vtr.dto';
import { UpdateMfgVtrDto } from './dto/update-mfg-vtr.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { FormDetailDto } from './dto/formDetail.dto';

@Controller('mfg-vtr')
export class MfgVtrController {
    constructor(private readonly mfgVtrService: MfgVtrService) {}

    @Post('createRequest')
    async create(
        @Body() createMfgVtrDto: CreateMfgVtrDto,
        @Req() req: Request,
    ) {
        try {
            const ip = getClientIP(req);
            const data = await this.mfgVtrService.create(createMfgVtrDto, ip);

            return {
                success: true,
                data,
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error instanceof Error ? error.message : 'Request failed',
            };
        }
    }

    @Get('getRequest')
    getRequest() {
        return this.mfgVtrService.getRequest();
    }

    @Post('getFormDetail')
    getFormDetail(@Body() data: FormDetailDto) {
        return this.mfgVtrService.getFormDetail(data);
    }

    @Patch('updateStatus')
    updateStatus(@Body() data: UpdateMfgVtrDto) {
        return this.mfgVtrService.updateStatus(data);
    }
}
