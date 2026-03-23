import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';

import { PDFDocument } from 'pdf-lib';
import { PDFParse } from 'pdf-parse';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrintedService } from './printed.service';

@Injectable()
export class PrintedMergeService {
    constructor(
        @Inject(forwardRef(() => PrintedService))
        private readonly printed: PrintedService,
    ) {}

    async splitFiles(
        pdfDoc: PDFDocument,
        outputDirectory: string,
        pageCount: number,
        splitFilesData: {
            fileName: string;
            filePath: string;
            pageNumber: number;
        }[],
    ) {
        const splitStartTime = Date.now();
        for (let i = 1; i < pageCount; i++) {
            const singlePageDoc = await PDFDocument.create();
            const [copiedPage] = await singlePageDoc.copyPages(pdfDoc, [i]);
            singlePageDoc.addPage(copiedPage);
            const singlePageBytes = await singlePageDoc.save();
            const parser = new PDFParse({
                data: Buffer.from(singlePageBytes),
            });
            let parsedData;
            try {
                parsedData = await parser.getText();
                const textContent = parsedData.text;
                const tagData = textContent.split('\n');
                const tagNo = tagData[0].substring(0, 12).replace(/\s/g, '');
                const newFileName = `${tagNo}.pdf`;
                const outputPath = path.join(outputDirectory, newFileName);
                await fs.writeFile(outputPath, singlePageBytes);
                splitFilesData.push({
                    fileName: tagNo,
                    filePath: outputPath,
                    pageNumber: i,
                });
            } finally {
                await parser.destroy();
            }
        }
        await this.printed.writeLog(
            `Split ${splitFilesData.length} pages in ${this.printed.formatElapsedTime(splitStartTime)}`,
        );
        return splitFilesData;
    }

    async mergePdfsFast(filesData: { filePath: string }[], outputPath: string) {
        const mergedPdf = await PDFDocument.create();
        const BATCH_SIZE = 100;
        for (let i = 0; i < filesData.length; i += BATCH_SIZE) {
            const batchStartTime = Date.now();
            const batch = filesData.slice(i, i + BATCH_SIZE);
            const buffers = await Promise.all(
                batch.map((file) => fs.readFile(file.filePath)),
            );
            for (const buffer of buffers) {
                const tempDoc = await PDFDocument.load(buffer);
                const [copiedPage] = await mergedPdf.copyPages(tempDoc, [0]);
                mergedPdf.addPage(copiedPage);
            }
            // await this.printed.writeLog(
            //     `Merged batch ${i / BATCH_SIZE + 1} (${batch.length} files) in ${this.formatElapsedTime(batchStartTime)}`,
            // );
        }

        const mergedPdfBytes = await mergedPdf.save({ useObjectStreams: true });
        await fs.writeFile(outputPath, mergedPdfBytes);
    }

    async compressPdfWithGhostscript(inputPath: string) {
        const command =
            '\\\\amecnas\\AMECWEB\\wwwroot\\production\\cdn\\Application\\gs\\gs10.00.0\\bin\\gswin32c.exe';
        const parsedPath = path.parse(inputPath);
        // `${parsedPath.name}.compressed${parsedPath.ext}`,
        const compressedPath = path.join(parsedPath.dir, `output.pdf`);
        await new Promise<void>((resolve, reject) => {
            const stderrChunks: Buffer[] = [];
            const child = spawn(command, [
                ...[],
                '-sDEVICE=pdfwrite',
                '-dCompatibilityLevel=1.7',
                '-dNOPAUSE',
                '-dQUIET',
                '-dBATCH',
                `-dPDFSETTINGS=/ebook`,
                `-sOutputFile=${compressedPath}`,
                inputPath,
            ]);

            child.stderr.on('data', (chunk) => stderrChunks.push(chunk));
            child.on('error', (error) => reject(error));
            child.on('close', (code) => {
                if (code === 0) {
                    resolve();
                    return;
                }

                reject(
                    new Error(
                        `Ghostscript exited with code ${code}: ${Buffer.concat(stderrChunks).toString().trim()}`,
                    ),
                );
            });
        });
    }
}
