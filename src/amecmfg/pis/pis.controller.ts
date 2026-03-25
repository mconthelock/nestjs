import {
    UseInterceptors,
    UploadedFiles,
    Controller,
    Post,
    Body,
    Get,
} from '@nestjs/common';
import { PisService } from './pis.service';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { PrintedService } from './printed/printed.service';

@Controller('pis')
export class PisController {
    constructor(
        private readonly pisService: PisService,
        private readonly printed: PrintedService,
    ) {}

    @Post('process-pdf')
    @UseInterceptors(getFileUploadInterceptor('files[]', true, 20))
    async processPdfDocument(
        @UploadedFiles() files: Express.Multer.File[],
        @Body()
        body: {},
    ) {
        return this.printed.processPdfDocument(body, files);
    }

    @Get('test')
    async test() {
        const input = `${process.env.IDTAG_FILE_PATH}TEST/PISESC1170326.pdf`;
        await this.printed.processPdfDocumentTs(
            {
                filename: 'PISESC1170326.pdf',
                schd_txt: '202604X',
                schd_p: 'P1',
                filedir: '',
            },
            input,
        );
        return { message: 'PIS Controller is working!' };
    }
}
