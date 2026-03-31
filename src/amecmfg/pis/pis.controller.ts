import {
    UseInterceptors,
    UploadedFiles,
    Controller,
    Post,
    Body,
    Get,
    Param,
} from '@nestjs/common';
import { PisService } from './pis.service';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';
import { PrintedService } from './printed/printed.service';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { SearchPisFilesDto } from './printed/dto/search-pis-file.dto';

@Controller('pis')
export class PisController {
    constructor(private readonly printed: PrintedService) {}

    @Post('print-list')
    @UseTransaction('workloadConnection')
    async getPrintPfd(
        @Body()
        body: SearchPisFilesDto,
    ) {
        return this.printed.findAllFiles(body);
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
            bmdate: string;
        },
    ) {
        return this.printed.processPdfDocument(body, files);
    }

    @Get('download/:id')
    @UseTransaction('workloadConnection')
    async downloadFile(@Param('id') id: number) {
        return this.printed.downloadFile(id);
    }

    @Post('update-files')
    @UseTransaction('workloadConnection')
    async updatePrinted(@Body() body: { files: number; status: number }) {
        return this.printed.updatePrint(body.files, body.status);
    }

    @Get('delete/:id')
    @UseTransaction('workloadConnection')
    async deletePdf(@Param('id') id: number) {
        return this.printed.deletePdf(id);
    }
}
