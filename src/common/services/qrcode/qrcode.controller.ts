import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { QrcodeService, QRCodeOptions } from './qrcode.service';
import { Response } from 'express';

interface GenerateQRCodeDto {
  text: string;
  options?: QRCodeOptions;
}

interface GenerateURLQRCodeDto {
  url: string;
  options?: QRCodeOptions;
}

interface GenerateEmailQRCodeDto {
  email: string;
  subject?: string;
  body?: string;
  options?: QRCodeOptions;
}

interface GenerateWiFiQRCodeDto {
  ssid: string;
  password: string;
  security?: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
  options?: QRCodeOptions;
}

@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  /**
   * สร้าง QR Code จากข้อความทั่วไป
   * POST /qrcode/generate
   */
  @Post('generate')
  async generateQRCode(@Body() data: GenerateQRCodeDto) {
    try {
      const qrCode = await this.qrcodeService.generateDataURL(
        data.text,
        data.options,
      );
      return {
        success: true,
        data: {
          qrCode,
          text: data.text,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * สร้าง QR Code สำหรับ URL
   * POST /qrcode/url
   */
  @Post('url')
  async generateURLQRCode(@Body() data: GenerateURLQRCodeDto) {
    try {
      const qrCode = await this.qrcodeService.generateForURL(
        data.url,
        data.options,
      );
      return {
        success: true,
        data: {
          qrCode,
          url: data.url,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * สร้าง QR Code สำหรับ Email
   * POST /qrcode/email
   */
  @Post('email')
  async generateEmailQRCode(@Body() data: GenerateEmailQRCodeDto) {
    try {
      const qrCode = await this.qrcodeService.generateForEmail(
        data.email,
        data.subject,
        data.body,
        data.options,
      );
      return {
        success: true,
        data: {
          qrCode,
          email: data.email,
          subject: data.subject,
          body: data.body,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * สร้าง QR Code สำหรับ WiFi
   * POST /qrcode/wifi
   */
  @Post('wifi')
  async generateWiFiQRCode(@Body() data: GenerateWiFiQRCodeDto) {
    try {
      const qrCode = await this.qrcodeService.generateForWiFi(
        data.ssid,
        data.password,
        data.security,
        data.hidden,
        data.options,
      );
      return {
        success: true,
        data: {
          qrCode,
          ssid: data.ssid,
          security: data.security || 'WPA',
          hidden: data.hidden || false,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * สร้าง QR Code เป็น SVG
   * POST /qrcode/svg
   */
  @Post('svg')
  async generateSVGQRCode(@Body() data: GenerateQRCodeDto) {
    try {
      const svgString = await this.qrcodeService.generateSVG(
        data.text,
        data.options,
      );
      return {
        success: true,
        data: {
          svg: svgString,
          text: data.text,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * สร้าง QR Code และส่งเป็นรูปภาพ PNG
   * GET /qrcode/image?text=hello&width=256&margin=2
   */
  @Get('image')
  async generateQRCodeImage(
    @Query('text') text: string,
    @Res() res: Response,
    @Query('width') width?: string,
    @Query('margin') margin?: string,
    @Query('dark') dark?: string,
    @Query('light') light?: string,
    @Query('comname') comname?: string,
  ) {
    try {
      if (!text) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Text parameter is required',
        });
      }

      const options: QRCodeOptions = {
        width: width ? parseInt(width) : 256,
        margin: margin ? parseInt(margin) : 2,
        color: {
          dark: dark || '#000000',
          light: light || '#FFFFFF',
        },
      };

      const buffer = await this.qrcodeService.generateBuffer(text, options);

      res.setHeader('Content-Type', 'image/png');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${comname || 'qrcode'}.png"`,
      );
      res.send(buffer);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * สร้าง QR Code และส่งเป็น SVG
   * GET /qrcode/svg-image?text=hello&width=256
   */
  @Get('svg-image')
  async generateSVGQRCodeImage(
    @Query('text') text: string,
    @Res() res: Response,
    @Query('width') width?: string,
    @Query('margin') margin?: string,
    @Query('dark') dark?: string,
    @Query('light') light?: string,
  ) {
    try {
      if (!text) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Text parameter is required',
        });
      }

      const options: QRCodeOptions = {
        width: width ? parseInt(width) : 256,
        margin: margin ? parseInt(margin) : 2,
        color: {
          dark: dark || '#000000',
          light: light || '#FFFFFF',
        },
      };

      const svgString = await this.qrcodeService.generateSVG(text, options);

      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Content-Disposition', `inline; filename="qrcode.svg"`);
      res.send(svgString);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}
