import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { IdtagService } from './idtag.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { SearchIdtagFilesDto } from './dto/search-idtag-file.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';

@ApiTags('AS400 - ID Tag')
@Controller('idtag')
export class IdtagController {
    constructor(private readonly tag: IdtagService) {}

    @Post('schd')
    findBySchd(@Body() body: { schd: string; schdp?: string }) {
        return this.tag.findBySchd(body.schd, body.schdp);
    }

    @Get('bmdate/:date')
    findByBMDate(@Param('date') date: string) {
        return this.tag.findByBMDate(date);
    }

    @Get('all')
    findAll() {
        return this.tag.findAll();
    }

    @Post('f110kp')
    findf110kpBySchd(@Body() body: { schd: string; p?: string }) {
        return this.tag.findf110kpBySchd(body.schd, body.p);
    }

    @Get('DetailByTag/:tag')
    findDetailByTag(@Param('tag') tag: string) {
        return this.tag.findDetailByTag(tag);
    }

    @Get('shop/:schd/:schdp/:shop')
    @ApiOperation({
        summary: 'Get AMEC Calendar by specify Start date and End date',
    })
    async findByShop(
        @Param('schd') schd: string,
        @Param('schdp') schdp: string,
        @Param('shop') shop: string,
    ) {
        const data = await this.tag.findBySchd(schd, schdp);
        const result = data
            .map((item) => {
                const newItem = { ...item };
                newItem.tags = item.tags.filter((tag) => {
                    return tag.process.some(
                        (pc) => pc.F02R03.substring(0, 2) === shop,
                    );
                });
                return newItem;
            })
            .filter((item) => item.tags.length > 0);
        return result;
    }

    @Get('jun')
    async getWeekList() {
        return this.tag.getWeekList();
    }

    @Post('process-pdf')
    @UseTransaction('workloadConnection')
    @UseInterceptors(getFileUploadInterceptor('files[]', true, 20))
    async processPdfDocument(
        @UploadedFiles() files: Express.Multer.File[],
        @Body()
        body: {
            filename: string;
            schd: string;
            schdp: string;
            filedir: string;
            bmdate: string;
        },
    ) {
        return this.tag.processPdfDocument(body, files);
    }

    @Get('process-pdf/status/:jobId')
    async getProcessPdfStatus(@Param('jobId') jobId: string) {
        return this.tag.getPdfProcessStatus(jobId);
    }

    @Post('print-list')
    @UseTransaction('workloadConnection')
    async getPrintPfd(
        @Body()
        body: SearchIdtagFilesDto,
    ) {
        return this.tag.findAllFiles(body);
    }

    @Post('process-logs')
    async processPdfLog(
        @Body()
        body: {
            schd: string;
            schdp: string;
            filedir: string;
            filename: string;
        },
    ) {
        return this.tag.findFilesLog(body);
    }

    @Get('print-master')
    async findAllFolder() {
        return this.tag.findMaster();
    }
}
