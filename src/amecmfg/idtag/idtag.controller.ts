import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';

import { IdtagService } from './idtag.service';
import { PrintedService } from './printed/printed.service';

import { SearchIdtagFilesDto } from './printed/dto/search-idtag-file.dto';

@ApiTags('AS400 - ID Tag')
@Controller('idtag')
export class IdtagController {
    constructor(
        private readonly tag: IdtagService,
        private readonly prined: PrintedService,
    ) {}

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

    //Print PDF on ITADMIN Project
    @Get('print-master')
    async findAllFolder() {
        return this.prined.findMaster();
    }

    @Post('print-list')
    @UseTransaction('workloadConnection')
    async getPrintPfd(
        @Body()
        body: SearchIdtagFilesDto,
    ) {
        return this.prined.findAllFiles(body);
    }

    @Post('process-pdf')
    @UseInterceptors(getFileUploadInterceptor('files[]', true, 20))
    async processPdfDocument(
        @UploadedFiles() files: Express.Multer.File[],
        @Body()
        body: {
            schd_number: string;
            schd_txt: string;
            schd_p: string;
            filedir: string;
            bmdate: string;
        },
    ) {
        return this.prined.processPdfDocument(body, files);
    }

    @Get('download/:id')
    @UseTransaction('workloadConnection')
    async downloadFile(@Param('id') id: number) {
        return this.prined.downloadFile(id);
    }

    /*




    @Get('process-logs/:id')
    async processPdfLog(@Param('id') id: number) {
        return this.tag.findFilesLog(id);
    }

    @Post('update-printed')
    @UseTransaction('workloadConnection')
    async updatePrintedStatus(
        @Body() body: { files: number; status: number; page: number },
    ) {
        return this.tag.updatePrintFileStatus(
            body.files,
            body.status,
            body.page,
        );
    }

    @Get('delete/:id')
    @UseTransaction('workloadConnection')
    async deletePdf(@Param('id') id: number) {
        return this.tag.deletePdf(id);
    }



    //Job scheduling for NC Detail
    @Get('notify-nc-detail')
    async notifyNcDetail() {
        return this.tag.notifyNcDetail();
    }

    @Get('process-nc-detail')
    async processNcDetail() {
        return this.tag.processNcDetail();
    }*/
}
