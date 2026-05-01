import {
    Controller,
    Body,
    Get,
    Post,
    Res,
    NotFoundException,
} from '@nestjs/common';
import { DatacenterService } from './datacenter.service';
import { Response } from 'express';
import * as path from 'path';

@Controller('docinv/datacenter')
export class DatacenterController {
    constructor(private readonly table: DatacenterService) {}

    @Get('tablelist')
    tablelist() {
        return this.table.findAll();
    }

    @Post('getReport')
    async getReport(
        @Body() data: { repId: string; repType: string },
        @Res() res: Response,
    ) {
        const localPath = await this.table.loadReport(data.repType, data.repId);
        if (!localPath) {
            throw new NotFoundException('Report not found');
        }
        const fileName = path.basename(localPath);
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${fileName}"`,
        );
        res.sendFile(localPath);
    }
}
