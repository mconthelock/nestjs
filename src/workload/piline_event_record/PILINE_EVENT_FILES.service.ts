import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, rm, writeFile } from 'fs/promises';
import { join, resolve } from 'path';

export interface PilineStagedFiles {
    directory?: string;
    attachments: { FILENAME: string; TYPEFILE: string; SEQ: number }[];
}

@Injectable()
export class PilineEventFilesService {
    private readonly logger = new Logger(PilineEventFilesService.name);

    private extension(buffer: Buffer): string {
        if (buffer.subarray(0, 5).toString() === '%PDF-') return '.pdf';
        if (
            buffer
                .subarray(0, 8)
                .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        )
            return '.png';
        if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255)
            return '.jpg';
        if (['GIF87a', 'GIF89a'].includes(buffer.subarray(0, 6).toString()))
            return '.gif';
        if (
            buffer.subarray(0, 4).toString() === 'RIFF' &&
            buffer.subarray(8, 12).toString() === 'WEBP'
        )
            return '.webp';
        if (
            buffer.subarray(4, 8).toString() === 'ftyp' &&
            ['heic', 'heix', 'hevc', 'hevx', 'mif1'].includes(
                buffer.subarray(8, 12).toString(),
            )
        )
            return '.heic';
        throw new BadRequestException(
            'Attachments must be PDF, JPEG, PNG, GIF, WEBP or HEIC',
        );
    }

    async stage(files: {
        eventFiles?: Express.Multer.File[];
        ngFiles?: Express.Multer.File[];
    }): Promise<PilineStagedFiles> {
        const entries = [
            ...(files.eventFiles || []).map((file) => ({ file, type: 'EVT' })),
            ...(files.ngFiles || []).map((file) => ({ file, type: 'NG' })),
        ];
        if (entries.length > 10)
            throw new BadRequestException('Maximum 10 attachments per record');
        const checked = entries.map((entry) => {
            if (
                !entry.file.buffer?.length ||
                entry.file.buffer.length > 5 * 1024 * 1024
            )
                throw new BadRequestException(
                    'Each attachment must be between 1 byte and 5 MB',
                );
            return { ...entry, extension: this.extension(entry.file.buffer) };
        });
        if (!checked.length) return { attachments: [] };
        const root =
            process.env.PILINE_UPLOAD_DIR ||
            (process.env.AMEC_FILE_PATH
                ? join(
                      process.env.AMEC_FILE_PATH,
                      process.env.STATE || 'development',
                      'piline',
                  )
                : resolve('public', 'uploads', 'piline'));
        const folder = randomUUID();
        const result: PilineStagedFiles = {
            directory: resolve(root, folder),
            attachments: [],
        };
        await mkdir(result.directory, { recursive: true });
        try {
            for (const [index, entry] of checked.entries()) {
                const safeName =
                    entry.file.originalname
                        .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
                        .replace(/\.[^.]*$/, '')
                        .slice(0, 100) || 'attachment';
                const storedName = `${index + 1}-${safeName}${entry.extension}`;
                await writeFile(
                    join(result.directory, storedName),
                    entry.file.buffer,
                    { flag: 'wx' },
                );
                result.attachments.push({
                    FILENAME: `${folder}/${storedName}`,
                    TYPEFILE: entry.type,
                    SEQ: index + 1,
                });
            }
            return result;
        } catch (error) {
            await this.cleanup(result);
            throw error;
        }
    }

    async cleanup(files: PilineStagedFiles) {
        if (!files.directory) return;
        try {
            await rm(files.directory, { recursive: true, force: true });
        } catch (error) {
            this.logger.error(
                `Failed to clean uncommitted PILINE files: ${files.directory}`,
                error.stack,
            );
        }
    }
}
