import * as fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export class PdfDocumentHelper {
  static async load(pdfPath: string): Promise<PDFDocument> {
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found : ${pdfPath}`);
    }

    const pdfDoc = await PDFDocument.load(
      fs.readFileSync(pdfPath),
    );

    pdfDoc.registerFontkit(fontkit);

    return pdfDoc;
  }
}