import * as fs from 'fs/promises';
import * as path from 'path';
import { degrees, rgb, PDFDocument } from 'pdf-lib';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { compressDimension } from 'src/common/helpers/resize-image.helper';
import { writeLineBox } from 'src/common/helpers/file-pdf.helper';
import { PrintedService } from './printed.service';
import { IdTagRepository } from './idtag.repository';
@Injectable()
export class PrintedImagesService {
    constructor(
        @Inject(forwardRef(() => PrintedService))
        private readonly printed: PrintedService,
        private readonly repo: IdTagRepository,
    ) {}

    private async setImagePath(img: string) {
        const image = path.join(process.env.IDTAG_FILE_PATH, `images/`, img);
        const thumb = path.join(process.env.IDTAG_FILE_PATH, `thumbnail/`, img);
        const fileExists = await fs
            .access(thumb)
            .then(() => true)
            .catch(() => false);

        if (fileExists) {
            return thumb;
        }

        const chkImgExists = await fs
            .access(image)
            .then(() => true)
            .catch(() => false);
        if (!chkImgExists) return null;

        const imageBytes = await fs.readFile(image);
        await compressDimension(imageBytes, 'image/jpeg', 500).then(
            (compressedBuffer) => {
                return fs.writeFile(thumb, compressedBuffer);
            },
        );
        return thumb;
    }

    async putImages(filesId: number) {
        const putImagesStartTime = Date.now();
        const imageData = await this.repo.findAllImage({
            filters: [
                { field: 'FILES_ID', op: 'eq', value: filesId },
                { field: 'PAGE_IMG', op: 'isNull' },
            ],
        });

        if (imageData.length === 0) {
            await this.printed.writeLog(
                `No images to put in PDF for FILES_ID ${filesId}`,
            );
            return;
        }

        for (const img of imageData) {
            try {
                if (!img.DWG_IMG) continue;
                const imagePath = await this.setImagePath(img.DWG_IMG);
                if (imagePath == null) continue;

                const cdir = await this.printed.getCurrentPdfDirectory();
                const pdfPath = path.join(cdir, `${img.PAGE_TAG}.pdf`);
                await this.embedImageToPdf(
                    pdfPath,
                    imagePath,
                    `${img.DWG_WEIGHT == null ? 0 : img.DWG_WEIGHT} ${img.DWG_WEIGHT_UNIT}/${img.DWG_UNIT}`,
                );
                await this.printed.writeLog(
                    `Put image ${img.DWG_IMG} to ${img.PAGE_TAG}`,
                );
                await this.repo.updatePageImage(
                    img.FILES_ID,
                    img.PAGE_NUM,
                    img.DWG_IMG,
                );
            } catch (error) {
                await this.printed.writeLog(
                    `Error processing image for tag ${img.PAGE_TAG}`,
                    error.message,
                );
            }
        }

        await this.printed.writeLog(
            `Put images in complete PDF in ${await this.printed.formatElapsedTime(putImagesStartTime)}`,
        );
    }

    private async embedImageToPdf(
        pdfPath: string,
        imagePath: string,
        text: string,
    ) {
        const pdfBytes = await fs.readFile(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const [page] = pdfDoc.getPages();
        if (!page) {
            throw new Error(`PDF file has no pages: ${pdfPath}`);
        }

        const opt = {
            pdfpage: page,
            fontsize: 14,
            drawBorder: {
                color: rgb(0, 0, 0),
                width: 1,
            },
            text: '',
            boxX: 283,
            boxY: 685,
            boxWidth: 270,
            boxHeight: 100,
            align: 'left',
        };
        await writeLineBox(opt);
        const imageBytes = await fs.readFile(imagePath);
        const extension = path.extname(imagePath).toLowerCase();
        const embeddedImage = ['.jpg', '.jpeg'].includes(extension)
            ? await pdfDoc.embedJpg(imageBytes)
            : extension === '.png'
              ? await pdfDoc.embedPng(imageBytes)
              : null;

        if (!embeddedImage) {
            throw new Error(`Unsupported image type: ${extension}`);
        }

        const imgHeight = 100;
        const imgWidth = Math.ceil(
            (embeddedImage.width / embeddedImage.height) * imgHeight,
        );

        const imgX = 270 - imgWidth + 283;
        const imgY = 79;
        page.drawImage(embeddedImage, {
            x: imgX,
            y: imgY,
            width: imgWidth,
            height: imgHeight,
        });

        const labelGap = 5;
        const labelWidth = 20;
        const labelHeight = imgHeight;
        const labelX = imgX - labelGap - labelWidth;
        const labelY = imgY;
        page.drawRectangle({
            x: labelX,
            y: labelY,
            width: labelWidth,
            height: labelHeight,
            borderWidth: 1,
            borderColor: rgb(0, 0, 0),
        });

        page.drawText(text, {
            x: labelX + 13,
            y: labelY + 15,
            size: 14,
            color: rgb(0, 0, 0),
            rotate: degrees(90),
        });
        await fs.writeFile(pdfPath, await pdfDoc.save());
    }
}
