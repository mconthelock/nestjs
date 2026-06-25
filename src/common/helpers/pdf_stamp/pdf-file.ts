import * as fs from 'fs';
import { PDFDocument } from 'pdf-lib';

export class PdfFileHelper {
  static async save(
    pdfDoc: PDFDocument,
    outputPath: string,
  ): Promise<void> {
    fs.writeFileSync(
      outputPath,
      await pdfDoc.save(),
    );
  }
}