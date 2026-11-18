import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { HealthcheckService } from './healthcheck.service';

@Controller('health')
export class HealthcheckController {
    constructor(private readonly healthcheckService: HealthcheckService) {}

    // 1. สำหรับเช็คว่า NestJS process ทำงานปกติ (แนะนำให้ใช้ตัวนี้ใน oxfile.toml)
    @Get()
    check() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }

    // 2. นำ HealthcheckService เดิมมาใช้เช็ค Database พร้อมคืน HTTP 503 เมื่อเกิด Error
    @Get('db')
    async checkDb() {
        const result = await this.healthcheckService.checkMitsu();
        if (result.status !== 'ok') {
            throw new ServiceUnavailableException(result);
        }
        return result;
    }
}
