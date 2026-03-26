import * as fs from 'fs/promises';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { FileLoggerService } from 'src/common/services/file-logger/file-logger.service';

export interface PdfProcessContext {
    logFileName: string;
    pdfDirectory: string;
}

@Injectable()
export class PrintedService {
    private readonly pdfContext = new AsyncLocalStorage<PdfProcessContext>();

    constructor(private readonly fileLogger: FileLoggerService) {}

    async setPdfPath(data): Promise<PdfProcessContext> {
        const file = data.filename.replace('.pdf', '');
        const pdfDirectory = path.join(
            process.env.IDTAG_FILE_PATH,
            `PRINTPIS/`,
            `${data.schd_txt}${data.schd_p}/`,
            `${data.filedir}/`,
            `${file}/`,
        );
        await fs.mkdir(pdfDirectory, { recursive: true });
        const logFileName = `PIS/${data.schd_txt}${data.schd_p}/${data.filedir}/${file}.log`;
        return {
            logFileName,
            pdfDirectory,
        };
    }

    async writeLog(message: string, error?: unknown, logFileName?: string) {
        const context = this.pdfContext.getStore();
        const targetLogFileName = logFileName ?? context?.logFileName;
        if (!targetLogFileName) {
            return;
        }
        await this.fileLogger.log(message, {
            fileName: targetLogFileName,
            error,
        });
    }

    async processPdfDocument(body: any, files: Express.Multer.File[]) {
        // Implement the logic to process the PDF document here
        // This is a placeholder implementation
        console.log('Processing PDF document with body:', body);
        console.log('Received files:', files);
        return { message: 'PDF document processed successfully' };
    }
    async processPdfDocumentTs(body: any, files: string) {
        await this.setPdfPath(body);
    }
}
