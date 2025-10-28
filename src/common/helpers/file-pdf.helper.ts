import { rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';

export async function writeLineBox(opt) {
  const { height } = opt.pdfpage.getSize();
  const yTop = height - opt.boxY;
  const fontHeight = opt.fontstyle.heightAtSize(opt.fontsize);

  // วาดเส้นกรอบถ้าต้องการ
  if (opt.drawBorder) {
    opt.pdfpage.drawRectangle({
      x: opt.boxX,
      y: yTop - opt.boxHeight,
      width: opt.boxWidth,
      height: opt.boxHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 0.5,
    });
  }

  const textWidth = opt.fontstyle.widthOfTextAtSize(opt.text, opt.fontsize);
  let xPos = opt.boxX;
  if (opt.align === 'center') xPos = opt.boxX + (opt.boxWidth - textWidth) / 2;
  else if (opt.align === 'right') xPos = opt.boxX + opt.boxWidth - textWidth;

  const yPos = yTop - (opt.boxHeight - fontHeight) / 2 - fontHeight + 4;
  // วาดข้อความ
  opt.pdfpage.drawText(opt.text, {
    x: xPos,
    y: yPos,
    size: opt.fontsize,
    font: opt.fontstyle,
    color: rgb(0, 0, 0),
  });
}

export async function protectedFile(opt) {
  let winPath = opt.output_path.replace(/\//g, '\\');
  if (!winPath.startsWith('\\\\')) {
    winPath = '\\\\' + winPath.replace(/^\\+/, '');
  }

  const input = path.join(winPath, opt.input);
  const output = path.join(winPath, opt.output);
  //   spawn qpdf
  // prettier-ignore
  const child = spawn('qpdf', [
    '--encrypt',
    '1234', // user password
    '5678', // owner password
    '256',
    '--print=full',
    '--modify=none',
    '--', // <-- ต้องมี
    input,
    output,
  ]);
  child.stdout.on('data', (data) => console.log(`stdout: ${data}`));
  child.stderr.on('data', (data) => console.error(`stderr: ${data}`));
  child.on('close', (code) => console.log(`qpdf exited with code ${code}`));
}

export async function drawGrid(pdfpage, spacing = 50, labelSpacing = 50) {
  const helveticaFont = await pdfpage.doc.embedFont(StandardFonts.Helvetica);
  const { width, height } = pdfpage.getSize();
  const lineColor = rgb(0.8, 0.8, 0.8);
  const labelColor = rgb(0, 0, 0);

  // วาดเส้นแนวตั้ง
  for (let x = 0; x <= width; x += spacing) {
    pdfpage.drawLine({
      start: { x, y: 0 },
      end: { x, y: height },
      thickness: 0.3,
      color: lineColor,
    });

    // ใส่เลขกำกับทุก labelSpacing
    if (x % labelSpacing === 0) {
      pdfpage.drawText(`${x}`, {
        x: x - 3, // offset เล็กน้อย
        y: height - 20,
        size: 8,
        font: helveticaFont,
        color: labelColor,
      });
    }
  }
  // วาดเส้นแนวนอน
  for (let y = 0; y <= height; y += spacing) {
    const yTopDown = height - y; // แปลง y ให้ไล่จากบนลงล่าง
    pdfpage.drawLine({
      start: { x: 0, y: yTopDown },
      end: { x: width, y: yTopDown },
      thickness: 0.3,
      color: lineColor,
    });

    if (y % labelSpacing === 0) {
      pdfpage.drawText(`${y}`, {
        x: 20,
        y: yTopDown - 3, // offset เล็กน้อย
        size: 8,
        font: helveticaFont,
        color: labelColor,
      });
    }
  }
}
