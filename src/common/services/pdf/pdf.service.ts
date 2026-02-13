import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';
import { createPDFDto, PDFOptions } from './dto/create.dto';
import { joinPaths } from 'src/common/utils/files.utils';

@Injectable()
export class PDFService {
  constructor() {}

  async generatePDF(dto: createPDFDto) {
    const {
      format,
      margin,
      printBackground,
      displayHeaderFooter,
      headerTemplate,
      footerTemplate,
      landscape,
      preferCSSPageSize,
      outline,
      tagged,
      scale,
      pageRanges,
      height,
      width,
      ...opt
    } = dto.options;
    let browser: any;
    try {
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();

      await page.setContent(dto.html, { waitUntil: 'networkidle' });
      await page.emulateMedia({ media: 'print' });

      const options: PDFOptions = {
        format: format || 'A4',
        margin: margin || {
          top: '18mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm',
        },
        printBackground: printBackground ?? false, // สำคัญสำหรับ Tailwind/Bootstrap ที่ใช้ background/color
        displayHeaderFooter: displayHeaderFooter || false,
        landscape: landscape || false,
        preferCSSPageSize: preferCSSPageSize || false,
        outline: outline || false,
        tagged: tagged || false,
        scale: scale ?? 1,
        pageRanges: pageRanges || '', // '1-5' or '1,3,5' or '1-3,5'
      };

      if (headerTemplate) options.headerTemplate = headerTemplate;
      if (footerTemplate) options.footerTemplate = footerTemplate;
      if (height) options.height = height;
      if (width) options.width = width;
      if (opt.path) options.path = opt.path;

      const buffer = await page.pdf(options);

      return {
        success: true,
        data: buffer,
      };
    } catch (error) {
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
