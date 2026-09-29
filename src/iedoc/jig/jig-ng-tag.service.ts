import { BadRequestException, Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { chromium } from 'playwright';
import { JigRepository } from './jig.repository';
import { JigFormKeyDto } from './dto/jig-form.dto';

const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export function tagDate(value: Date | string | null): string {
    if (!value) return '-';
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [y, m, d] = value.split('-');
        return `${d}/${m}/${y}`;
    }
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return '-';
    return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Bangkok', day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

export function ngTagHtml(data: any, regular: string, bold: string): string {
    const { form, ng, stamps, checkDate } = data;
    const e = escapeHtml;
    const stamp = (step: string, label: string, top: string | null) => {
        const row = stamps.find((s) => String(s.CSTEPNO).trim() === step && String(s.CAPVSTNO).trim() === '1' && s.DAPVDATE);
        const name = row?.SNAME?.trim().split(/\s+/)[0] || '-';
        const heading = step === '--' || step === '07' ? row?.SSEC : top;
        return `<section class="sign"><div class="circle ${row ? '' : 'pending'}">${row
            ? `<div class="stamp-line fit">${e(heading || '-')}</div><div class="stamp-date">${e(tagDate(row.DAPVDATE))}</div><div class="stamp-line fit">${e(name)}</div>`
            : '<div class="pending-text">PENDING</div>'}</div><b>${label}</b></section>`;
    };
    const actions = new Set(String(ng.ACTION ?? '').split(',').map((value) => value.trim().toUpperCase()));
    const known = ['ADJUST', 'MODIFY', 'REPLACE'];
    const actionLine = known.map((a) => `<span><i>${actions.has(a) ? 'X' : ''}</i>${a}</span>`).join('');
    return `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face{font-family:Tag;src:url(data:font/ttf;base64,${regular})} @font-face{font-family:Tag;src:url(data:font/ttf;base64,${bold});font-weight:700}
    @page{size:A5 portrait;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Tag,sans-serif;color:#171717;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .page{width:148mm;height:210mm;padding:5mm;background:white}.tag{height:200mm;border:3mm solid #a50d12;border-radius:6mm;position:relative;padding:0 3mm 3mm;display:flex;flex-direction:column}
    .cap{height:9mm;background:#a50d12;margin:0 -3mm 3mm;flex-shrink:0}
    h1{font-size:21pt;text-align:center;margin:0 -2mm 3mm;padding:1mm 0;border:0.5mm solid #171717;line-height:1.1;flex-shrink:0}
    .meta{display:grid;grid-template-columns:1fr 1fr;gap:2mm 4mm;font-size:13pt;height:25mm;flex-shrink:0}.meta div{overflow:hidden;line-height:1.1;overflow-wrap:anywhere}.meta b{font-size:12pt}
    .block{border-top:0.3mm solid #444;padding-top:2mm;flex-shrink:0}.block h2{font-size:14pt;margin:0 0 1mm;line-height:1.1}.defect{height:43mm}.copy{white-space:pre-wrap;overflow-wrap:anywhere;font-size:14pt;line-height:1.16;overflow:hidden}.defect .copy{height:33mm}
    .actions{height:13mm;display:flex;align-items:center;gap:4mm;font-size:12pt;flex-shrink:0;border-top:0.3mm solid #444}.actions span{display:flex;align-items:center;gap:1mm}.actions i{display:inline-block;width:4mm;height:4mm;border:0.3mm solid #222;font-style:normal;text-align:center;line-height:4mm;font-weight:bold}.action-text{max-height:10mm;overflow:hidden;overflow-wrap:anywhere}
    .corrective{height:24mm}.corrective .copy{height:16mm}.plan{height:17mm;font-size:13pt;line-height:1.15;overflow:hidden;border-top:0.3mm solid #444;padding:2mm 0;flex-shrink:0}
    .signatures{height:40mm;display:grid;grid-template-columns:repeat(3,1fr);border:0.3mm solid #a50d12;flex-shrink:0}.sign{border-right:0.3mm solid #a50d12;text-align:center;padding-top:2mm;display:flex;flex-direction:column;align-items:center;gap:1mm}.sign:last-child{border:0}.sign>b{font-size:12pt;line-height:1.1}
    .circle{height:28mm;width:28mm;border:0.55mm solid #b6171e;border-radius:50%;outline:0.25mm solid #b6171e;outline-offset:-1.4mm;color:#b6171e;display:flex;flex-direction:column;justify-content:center;align-items:center;font-weight:bold;padding:3mm}
    .stamp-line{height:6mm;width:22mm;overflow:hidden;white-space:nowrap;font-size:12pt;line-height:6mm}.stamp-date{border-top:0.25mm solid;border-bottom:0.25mm solid;width:21mm;font-size:10pt;line-height:6mm}.pending{color:#aaa;border-color:#bbb;outline-color:#bbb}.pending-text{font-size:10pt}
    footer{text-align:center;font-size:8pt;color:#777;margin-top:auto;line-height:1.1;padding-top:1mm}
    </style></head><body><div class="page"><article class="tag"><div class="cap"></div>
    <h1>NG TAG INSPECTION JIG</h1><div class="meta">
    <div class="fit"><b>JIG NO:</b> ${e(form.JIG_NO)}</div><div class="fit"><b>JIG NAME:</b> ${e(form.JIG_NAME)}</div>
    <div class="fit"><b>PROC NO:</b> ${e(form.PROCESS_CODE || '-')} / <b>ITEM:</b> ${e(form.ITEMNO || '-')}</div><div class="fit"><b>CHECK DATE:</b> ${e(tagDate(checkDate))}</div></div>
    <section class="block defect"><h2>DEFECT DETAIL :</h2><div class="copy fit">${e(ng.DEFECT_DETAIL)}</div></section>
    <div class="actions"><b>ACTION :</b>${actionLine}</div>
    <section class="block corrective"><h2>CORRECTIVE ACTION :</h2><div class="copy fit">${e(ng.CORRECTIVE)}</div></section>
    <div class="plan fit"><b>PLAN :</b> Complete by ${e(tagDate(ng.PLAN_DATE))}</div>
    <div class="signatures">${stamp('--', 'INSPECTOR', null)}${stamp('06', 'APPROVAL', 'AMEC')}${stamp('07', 'FOREMAN', null)}</div>
    <footer>Auto e-Stamp - generated from recorded step approvals</footer></article></div></body></html>`;
}

@Injectable()
export class JigNgTagService {
    constructor(private readonly repository: JigRepository) {}

    async generate(key: JigFormKeyDto): Promise<Buffer> {
        const data = await this.repository.getNgTagData(key);
        return this.render(data);
    }

    async render(data: any): Promise<Buffer> {
        const [regular, bold] = await Promise.all([
            readFile(join(process.cwd(), 'public/fonts/THSarabun.ttf')),
            readFile(join(process.cwd(), 'public/fonts/THSarabun Bold.ttf')),
        ]);
        const browser = await chromium.launch({ headless: true });
        try {
            const page = await browser.newPage();
            await page.setContent(ngTagHtml(data, regular.toString('base64'), bold.toString('base64')), { waitUntil: 'load' });
            await page.emulateMedia({ media: 'print' });
            await page.evaluate(async () => {
                await document.fonts.ready;
                for (const el of Array.from(document.querySelectorAll<HTMLElement>('.fit'))) {
                    let size = parseFloat(getComputedStyle(el).fontSize);
                    while ((el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) && size > 9) {
                        size -= 0.25;
                        el.style.fontSize = `${size}px`;
                        for (const child of Array.from(el.querySelectorAll<HTMLElement>('b'))) child.style.fontSize = 'inherit';
                    }
                    if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1)
                        throw new Error('NG tag content exceeds A5 layout capacity');
                }
            });
            return await page.pdf({ format: 'A5', printBackground: true, preferCSSPageSize: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
        } catch (error) {
            if (String(error.message).includes('NG tag content exceeds A5 layout capacity'))
                throw new BadRequestException('NG tag text is too long for a readable A5 page; shorten the text or stamp name');
            throw error;
        } finally {
            await browser.close();
        }
    }
}
