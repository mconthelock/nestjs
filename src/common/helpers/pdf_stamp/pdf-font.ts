import * as fs from 'fs';
import * as path from 'path';
import { PDFDocument } from 'pdf-lib';

export class PdfFontHelper {
  static async loadThaiFont(pdfDoc: PDFDocument) {
    const fontPath = path.join(
      process.cwd(),
      'public/fonts/THSarabun Bold.ttf',
    );

    if (!fs.existsSync(fontPath)) {
      throw new Error(`Font file not found : ${fontPath}`);
    }

    return pdfDoc.embedFont(
      fs.readFileSync(fontPath),
    );
  }
}