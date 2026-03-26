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
        body: {
            schd_number: string;
            schd_txt: string;
            schd_p: string;
            bmdate: string;
        },
    ) {
        return this.printed.processPdfDocument(body, files);
    }
}
