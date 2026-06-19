import { PDFFont, PDFPage, rgb } from 'pdf-lib';
import { CircleStampOptions, DrawTextOptions } from './pdf-types';

export class PdfDrawer {
  static drawText(
    page: PDFPage,
    font: PDFFont,
    text: string,
    options: DrawTextOptions,
  ) {
    const {
      x,
      y,
      size,
      maxWidth = 300,
      color = rgb(1, 0, 0),
    } = options;

    if (!text) return;

    page.drawText(text, {
      x,
      y,
      size,
      font,
      color,
      maxWidth,
    });
  }

  static drawCenterText(
    page: PDFPage,
    font: PDFFont,
    text: string,
    x: number,
    y: number,
    size: number,
    color = rgb(1, 0, 0),
  ) {
    if (!text) return;

    page.drawText(text, {
      x: x - font.widthOfTextAtSize(text, size) / 2,
      y,
      size,
      font,
      color,
    });
  }

  static drawCircleStamp(
    page: PDFPage,
    font: PDFFont,
    options: CircleStampOptions,
  ) {
    const {
      x,
      y,
      r = 36,

      topText = '',
      middleText = '',
      bottomText = '',

      topTextSize = 15,
      middleTextSize = 15,
      bottomTextSize = 11,

      borderWidth = 1,
      lineWidth = 1,
      color = rgb(1, 0, 0),
    } = options;

    const line1Y = y + 6;
    const line2Y = y - 12;

    page.drawCircle({
      x,
      y,
      size: r,
      borderColor: color,
      borderWidth,
    });

    page.drawLine({
      start: { x: x - r, y: line1Y },
      end: { x: x + r, y: line1Y },
      thickness: lineWidth,
      color,
    });

    const dy = line2Y - y;
    const dx = Math.sqrt(r * r - dy * dy);

    page.drawLine({
      start: { x: x - dx, y: line2Y },
      end: { x: x + dx, y: line2Y },
      thickness: lineWidth,
      color,
    });

    PdfDrawer.drawCenterText(page, font, topText, x, y + 13, topTextSize, color);
    PdfDrawer.drawCenterText(page, font, middleText, x, y - 8, middleTextSize, color);
    PdfDrawer.drawCenterText(page, font, bottomText, x, y - 25, bottomTextSize, color);
  }
}