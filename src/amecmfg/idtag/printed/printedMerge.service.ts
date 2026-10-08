import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';

import { PDFDocument } from 'pdf-lib';
import { PDFParse } from 'pdf-parse';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { OrderInfo, PrintedService } from './printed.service';
import { PrintedExtractService } from './printedExtract.service';

@Injectable()
export class PrintedMergeService {
    constructor(
        @Inject(forwardRef(() => PrintedService))
        private readonly printed: PrintedService,
        private readonly extract: PrintedExtractService,
    ) {}

    async splitFiles(
        pdfDoc: PDFDocument,
        outputDirectory: string,
        pageCount: number,
        splitFilesData: {
            fileName: string;
            filePath: string;
            pageNumber: number;
            item: string;
            packing: string;
            process: string;
            drawing: string;
            fileMfgNo: OrderInfo[] | null;
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
                const mfgno = this.extract.extractOrderEntries(textContent);
                const itemno =
                    this.extract.extractItemPackingEntries(textContent);
                const process =
                    this.extract.extractProcessListEntries(textContent);
                const dwgno = this.extract.extractDrawingEntries(textContent);
                const newFileName = `${tagNo}.pdf`;
                const outputPath = path.join(outputDirectory, newFileName);
                await fs.writeFile(outputPath, singlePageBytes);
                splitFilesData.push({
                    fileName: tagNo,
                    filePath: outputPath,
                    pageNumber: i,
                    item: itemno.item,
                    packing: itemno.itemPacking,
                    process: process,
                    drawing: dwgno,
                    fileMfgNo: mfgno,
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
            await this.printed.writeLog(
                `Merged batch ${i / BATCH_SIZE + 1} (${batch.length} files) in ${this.printed.formatElapsedTime(batchStartTime)}`,
            );
        }

        const mergedPdfBytes = await mergedPdf.save({ useObjectStreams: true });
        await fs.writeFile(outputPath, mergedPdfBytes);
    }

    async compressPdfWithGhostscript(inputPath: string) {
        const command = path.resolve(
            process.cwd(),
            'public',
            'gs',
            'gs10.07.1',
            'bin',
            'gswin64c.exe',
        );
        const parsedPath = path.parse(inputPath);
        const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const compressedPath = path.join(
            parsedPath.dir,
            `${parsedPath.name}.compressed-${uniqueSuffix}${parsedPath.ext}`,
        );

        try {
            await fs.access(inputPath, fs.constants.R_OK);
            const inputStat = await fs.stat(inputPath);
            await this.printed.writeLog(
                `[Ghostscript] input exists: ${inputPath}, size=${inputStat.size} bytes`,
            );
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            await this.printed.writeLog(
                `[Ghostscript] input access failed: ${inputPath}`,
                message,
            );
            throw new Error(
                `Ghostscript input not readable: ${inputPath} (${message})`,
            );
        }

        try {
            await fs.access(
                parsedPath.dir,
                fs.constants.W_OK | fs.constants.X_OK,
            );
            await this.printed.writeLog(
                `[Ghostscript] output directory writable: ${parsedPath.dir}`,
            );
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            await this.printed.writeLog(
                `[Ghostscript] output directory permission denied: ${parsedPath.dir}`,
                message,
            );
            throw new Error(
                `Ghostscript output directory not writable: ${parsedPath.dir} (${message})`,
            );
        }

        try {
            await fs.access(command, fs.constants.X_OK);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            await this.printed.writeLog(
                `[Ghostscript] executable not accessible: ${command}`,
                message,
            );
            throw new Error(
                `Ghostscript executable missing or not executable: ${command} (${message})`,
            );
        }

        await this.printed.writeLog(
            `[Ghostscript] starting compress: command=${command}, input=${inputPath}, output=${compressedPath}`,
        );

        const stdoutChunks: Buffer[] = [];
        const stderrChunks: Buffer[] = [];
        await new Promise<void>((resolve, reject) => {
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

            child.stdout?.on('data', (chunk) =>
                stdoutChunks.push(Buffer.from(chunk)),
            );
            child.stderr?.on('data', (chunk) =>
                stderrChunks.push(Buffer.from(chunk)),
            );
            child.on('error', async (error) => {
                await this.printed.writeLog(
                    `[Ghostscript] spawn error: ${error.message}`,
                    error.stack ?? error.message,
                );
                reject(error);
            });
            child.on('close', async (code) => {
                const stdoutText = Buffer.concat(stdoutChunks)
                    .toString()
                    .trim();
                const stderrText = Buffer.concat(stderrChunks)
                    .toString()
                    .trim();

                if (stdoutText) {
                    await this.printed.writeLog(
                        `[Ghostscript] stdout: ${stdoutText}`,
                    );
                }
                if (stderrText) {
                    await this.printed.writeLog(
                        `[Ghostscript] stderr: ${stderrText}`,
                    );
                }

                if (code === 0) {
                    try {
                        const compressedStat = await fs.stat(compressedPath);
                        await this.printed.writeLog(
                            `[Ghostscript] output created: ${compressedPath}, size=${compressedStat.size} bytes`,
                        );
                        if (compressedStat.size === 0) {
                            throw new Error(
                                `Ghostscript created an empty output file: ${compressedPath}`,
                            );
                        }
                        resolve();
                        return;
                    } catch (error) {
                        const message =
                            error instanceof Error
                                ? error.message
                                : String(error);
                        await this.printed.writeLog(
                            `[Ghostscript] output validation failed: ${compressedPath}`,
                            message,
                        );
                        reject(new Error(message));
                        return;
                    }
                }

                const errorText = stderrText || `exit code ${code}`;
                await this.printed.writeLog(
                    `[Ghostscript] exit code ${code}, failed output=${compressedPath}`,
                    errorText,
                );
                reject(
                    new Error(
                        `Ghostscript exited with code ${code}: ${errorText}`,
                    ),
                );
            });
        });

        return compressedPath;
    }
}
