import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import sharp from 'sharp';

export interface QRCodeOptions {
    width?: number;
    margin?: number;
    color?: {
        dark?: string;
        light?: string;
    };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

@Injectable()
export class QrcodeService {
    /**
     * สร้าง QR Code เป็น Data URL (base64)
     * @param text ข้อความที่ต้องการแปลงเป็น QR Code
     * @param options ตัวเลือกการสร้าง QR Code
     * @returns Promise<string> Data URL ของ QR Code
     */
    async generateDataURL(
        text: string,
        options?: QRCodeOptions,
    ): Promise<string> {
        try {
            const qrOptions = {
                width: options?.width || 256,
                margin: options?.margin || 2,
                color: {
                    dark: options?.color?.dark || '#000000',
                    light: options?.color?.light || '#FFFFFF',
                },
                errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
            };

            const processedText = await this.processedText(text);
            const dataURL = await QRCode.toDataURL(processedText, qrOptions);
            return dataURL;
        } catch (error) {
            throw new Error(`Failed to generate QR Code: ${error.message}`);
        }
    }

    async generateSVGWithCaption(
        text: string,
        caption: string,
        options?: QRCodeOptions & { captionFontSize?: number },
    ): Promise<string> {
        const width = options?.width || 256;
        const fontSize = options?.captionFontSize || 16;
        const captionHeight = fontSize + 10;

        const qrSvg = await this.generateSVG(text, options);
        // ดึงเฉพาะเนื้อใน เอา <svg> wrapper ออก
        const inner = qrSvg.replace(/<\/?svg[^>]*>/g, '');

        return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${width + captionHeight}" viewBox="0 0 ${width} ${width + captionHeight}">
        <rect width="100%" height="100%" fill="${options?.color?.light || '#FFFFFF'}"/>
        ${inner}
        <text x="50%" y="${width + fontSize}" text-anchor="middle" font-family="sans-serif" font-size="${fontSize}" fill="${options?.color?.dark || '#000000'}">${caption}</text>
        </svg>`;
    }

    /**
     * สร้าง QR Code พร้อมข้อความด้านล่าง เป็น Buffer (PNG)
     * @param text ข้อความที่ต้องการแปลงเป็น QR Code
     * @param caption ข้อความที่แสดงด้านล่าง QR Code
     * @param options ตัวเลือกการสร้าง QR Code
     * @returns Promise<Buffer> Buffer ของ QR Code พร้อม caption
     */
    async generateBufferWithCaption(
        text: string,
        caption: string,
        options?: QRCodeOptions & { captionFontSize?: number },
    ): Promise<Buffer> {
        try {
            const width = options?.width || 256;
            const fontSize = options?.captionFontSize || Math.round(width * 0.07);
            const captionHeight = fontSize + 16;
            const darkColor = options?.color?.dark || '#000000';
            const lightColor = options?.color?.light || '#FFFFFF';

            const qrBuffer = await this.generateBuffer(text, options);

            const captionSvg = `<svg width="${width}" height="${captionHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${lightColor}"/>
  <text x="50%" y="8" text-anchor="middle" dominant-baseline="text-before-edge" font-family="sans-serif" font-size="${fontSize}" fill="${darkColor}">${this.escapeXml(caption)}</text>
</svg>`;

            return await sharp({
                create: {
                    width,
                    height: width + captionHeight,
                    channels: 4,
                    background: lightColor,
                },
            })
                .composite([
                    { input: qrBuffer, top: 0, left: 0 },
                    { input: Buffer.from(captionSvg), top: width, left: 0 },
                ])
                .png()
                .toBuffer();
        } catch (error) {
            throw new Error(
                `Failed to generate QR Code with caption: ${error.message}`,
            );
        }
    }

    /**
     * สร้าง QR Code พร้อมข้อความด้านล่าง เป็น Data URL (base64)
     * @param text ข้อความที่ต้องการแปลงเป็น QR Code
     * @param caption ข้อความที่แสดงด้านล่าง QR Code
     * @param options ตัวเลือกการสร้าง QR Code
     * @returns Promise<string> Data URL ของ QR Code พร้อม caption
     */
    async generateDataURLWithCaption(
        text: string,
        caption: string,
        options?: QRCodeOptions & { captionFontSize?: number },
    ): Promise<string> {
        const buffer = await this.generateBufferWithCaption(text, caption, options);
        return `data:image/png;base64,${buffer.toString('base64')}`;
    }

    /**
     * escape อักขระพิเศษสำหรับ XML/SVG
     */
    private escapeXml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    /**
     * สร้าง QR Code เป็น Buffer (สำหรับบันทึกเป็นไฟล์)
     * @param text ข้อความที่ต้องการแปลงเป็น QR Code
     * @param options ตัวเลือกการสร้าง QR Code
     * @returns Promise<Buffer> Buffer ของ QR Code
     */
    async generateBuffer(
        text: string,
        options?: QRCodeOptions,
    ): Promise<Buffer> {
        try {
            // แปลง escape sequences เช่น \r, \n, \t ให้เป็นตัวอักษรจริง
            const qrOptions = {
                width: options?.width || 256,
                margin: options?.margin || 2,
                color: {
                    dark: options?.color?.dark || '#000000',
                    light: options?.color?.light || '#FFFFFF',
                },
                errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
            };

            const processedText = await this.processedText(text);
            const buffer = await QRCode.toBuffer(processedText, qrOptions);
            return buffer;
        } catch (error) {
            throw new Error(
                `Failed to generate QR Code buffer: ${error.message}`,
            );
        }
    }

    /**
     * สร้าง QR Code เป็น SVG string
     * @param text ข้อความที่ต้องการแปลงเป็น QR Code
     * @param options ตัวเลือกการสร้าง QR Code
     * @returns Promise<string> SVG string ของ QR Code
     */
    async generateSVG(text: string, options?: QRCodeOptions): Promise<string> {
        try {
            const qrOptions = {
                width: options?.width || 256,
                margin: options?.margin || 2,
                color: {
                    dark: options?.color?.dark || '#000000',
                    light: options?.color?.light || '#FFFFFF',
                },
                errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
            };

            const processedText = await this.processedText(text);
            const svgString = await QRCode.toString(processedText, {
                type: 'svg',
                ...qrOptions,
            });
            return svgString;
        } catch (error) {
            throw new Error(`Failed to generate QR Code SVG: ${error.message}`);
        }
    }

    /**
     * สร้าง QR Code สำหรับ URL
     * @param url URL ที่ต้องการสร้าง QR Code
     * @param options ตัวเลือกการสร้าง QR Code
     * @returns Promise<string> Data URL ของ QR Code
     */
    async generateForURL(
        url: string,
        options?: QRCodeOptions,
    ): Promise<string> {
        // ตรวจสอบว่าเป็น URL ที่ถูกต้อง
        try {
            new URL(url);
        } catch {
            throw new Error('Invalid URL format');
        }

        return this.generateDataURL(url, options);
    }

    /**
     * สร้าง QR Code สำหรับ Email
     * @param email อีเมลที่ต้องการสร้าง QR Code
     * @param subject หัวข้ออีเมล (optional)
     * @param body เนื้อหาอีเมล (optional)
     * @param options ตัวเลือกการสร้าง QR Code
     * @returns Promise<string> Data URL ของ QR Code
     */
    async generateForEmail(
        email: string,
        subject?: string,
        body?: string,
        options?: QRCodeOptions,
    ): Promise<string> {
        let mailtoURL = `mailto:${email}`;

        const params = new URLSearchParams();
        if (subject) params.append('subject', subject);
        if (body) params.append('body', body);

        if (params.toString()) {
            mailtoURL += `?${params.toString()}`;
        }

        return this.generateDataURL(mailtoURL, options);
    }

    /**
     * สร้าง QR Code สำหรับ WiFi
     * @param ssid ชื่อ WiFi network
     * @param password รหัสผ่าน WiFi
     * @param security ประเภทความปลอดภัย (WPA, WEP, หรือ nopass)
     * @param hidden WiFi network ซ่อนอยู่หรือไม่
     * @param options ตัวเลือกการสร้าง QR Code
     * @returns Promise<string> Data URL ของ QR Code
     */
    async generateForWiFi(
        ssid: string,
        password: string,
        security: 'WPA' | 'WEP' | 'nopass' = 'WPA',
        hidden: boolean = false,
        options?: QRCodeOptions,
    ): Promise<string> {
        const wifiString = `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
        return this.generateDataURL(wifiString, options);
    }

    async processedText(text: string) {
        return text
            .replace(/\\r/g, '\r')
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '\t')
            .replace(/\\b/g, '\b')
            .replace(/\\f/g, '\f')
            .replace(/\\v/g, '\v')
            .replace(/\\\\/g, '\\');
    }
}
