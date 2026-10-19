import { rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { randomUUID } from 'crypto';
import { spawn } from 'child_process';

export async function writeLineBox(opt) {
    const fontstyle =
        opt.fontstyle ||
        (await opt.pdfpage.doc.embedFont(StandardFonts.Helvetica));
    const { height } = opt.pdfpage.getSize();
    const yTop = height - opt.boxY;
    const fontHeight = fontstyle.heightAtSize(opt.fontsize);
    const fontColor = opt.fontColor || rgb(0, 0, 0);
    const textOpacity = opt.textOpacity ?? 1;

    // วาดเส้นกรอบถ้าต้องการ
    if (opt.drawBorder) {
        opt.pdfpage.drawRectangle({
            x: opt.boxX,
            y: yTop - opt.boxHeight,
            width: opt.boxWidth,
            height: opt.boxHeight,
            borderColor: opt.drawBorder.color || rgb(0, 0, 0),
            borderWidth: opt.drawBorder.width || 0.5,
            color: opt.drawBorder.bgColor || rgb(1, 1, 1),
            borderOpacity: opt.drawBorder.borderOpacity ?? 1,
        });
    }

    const textWidth = fontstyle.widthOfTextAtSize(opt.text, opt.fontsize);
    let xPos = opt.boxX;
    if (opt.align === 'center')
        xPos = opt.boxX + (opt.boxWidth - textWidth) / 2;
    else if (opt.align === 'right') xPos = opt.boxX + opt.boxWidth - textWidth;

    const yPos = yTop - (opt.boxHeight - fontHeight) / 2 - fontHeight + 4;
    // วาดข้อความ
    opt.pdfpage.drawText(opt.text, {
        x: xPos,
        y: yPos,
        size: opt.fontsize,
        font: fontstyle,
        color: fontColor,
        opacity: textOpacity,
    });
}

export async function protectedFile(opt) {
    let winPath = opt.output_path.replace(/\//g, '\\');
    if (!winPath.startsWith('\\\\')) {
        winPath = '\\\\' + winPath.replace(/^\\+/, '');
    }

    const networkInput = path.join(winPath, opt.input);
    const finalOutput = path.join(winPath, opt.output);
    // Ghostscript เปิดไฟล์บน UNC path ที่มีวรรณยุกต์/วงเล็บไม่ได้ จึงต้อง copy input/output ผ่าน local temp
    const localInput = path.join(os.tmpdir(), `${randomUUID()}_${opt.input}`);
    const localOutput = path.join(os.tmpdir(), `${randomUUID()}_${opt.output}`);
    await fs.copyFile(networkInput, localInput);
    const command = path.resolve(
        process.cwd(),
        'public',
        'gs',
        'gs10.07.1',
        'bin',
        'gswin64c.exe',
    );
    await new Promise<void>((resolve, reject) => {
        const stderrChunks: Buffer[] = [];
        const stdoutChunks: Buffer[] = [];
        const child = spawn(command, [
            ...[],
            '-sDEVICE=pdfwrite',
            '-dCompatibilityLevel=1.7',
            `-sOwnerPassword=${opt.adminpassword}`,
            `-sUserPassword=${opt.userpassword}`,
            '-dEncryptionR=3',
            '-dKeyLength=128',
            '-dPermissions=-4', // ห้ามพิมพ์และแก้ไข
            '-dNOPAUSE',
            '-dQUIET',
            '-dBATCH',
            `-dPDFSETTINGS=/ebook`,
            `-sOutputFile=${localOutput}`,
            localInput,
        ]);

        child.stdout.on('data', (chunk) => stdoutChunks.push(chunk));
        child.stderr.on('data', (chunk) => stderrChunks.push(chunk));
        child.on('error', (error) => reject(error));
        child.on('close', (code) => {
            if (code === 0) {
                resolve();
                return;
            }

            const output = Buffer.concat([...stdoutChunks, ...stderrChunks])
                .toString()
                .trim();
            reject(
                new Error(`Ghostscript exited with code ${code}: ${output}`),
            );
        });
    });

    try {
        await fs.copyFile(localOutput, finalOutput);
    } finally {
        await fs.unlink(localInput).catch(() => {});
        await fs.unlink(localOutput).catch(() => {});
    }
}

export async function drawGrid(pdfpage, spacing = 50, labelSpacing = 50) {
    const helveticaFont = await pdfpage.doc.embedFont(StandardFonts.Helvetica);
    const { width, height } = pdfpage.getSize();
    const lineColor = rgb(0.5, 0.5, 0.5);
    const labelColor = rgb(0.5, 0.5, 0.5);

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
