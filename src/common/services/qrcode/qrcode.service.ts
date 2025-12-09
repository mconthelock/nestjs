import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

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

      const dataURL = await QRCode.toDataURL(text, qrOptions);
      return dataURL;
    } catch (error) {
      throw new Error(`Failed to generate QR Code: ${error.message}`);
    }
  }

  /**
   * สร้าง QR Code เป็น Buffer (สำหรับบันทึกเป็นไฟล์)
   * @param text ข้อความที่ต้องการแปลงเป็น QR Code
   * @param options ตัวเลือกการสร้าง QR Code
   * @returns Promise<Buffer> Buffer ของ QR Code
   */
  async generateBuffer(text: string, options?: QRCodeOptions): Promise<Buffer> {
    try {
      // แปลง escape sequences เช่น \r, \n, \t ให้เป็นตัวอักษรจริง
      const processedText = text
        .replace(/\\r/g, '\r')
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\b/g, '\b')
        .replace(/\\f/g, '\f')
        .replace(/\\v/g, '\v')
        .replace(/\\\\/g, '\\');
      const qrOptions = {
        width: options?.width || 256,
        margin: options?.margin || 2,
        color: {
          dark: options?.color?.dark || '#000000',
          light: options?.color?.light || '#FFFFFF',
        },
        errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
      };

      const buffer = await QRCode.toBuffer(processedText, qrOptions);
      return buffer;
    } catch (error) {
      throw new Error(`Failed to generate QR Code buffer: ${error.message}`);
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

      const svgString = await QRCode.toString(text, {
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
  async generateForURL(url: string, options?: QRCodeOptions): Promise<string> {
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
}
