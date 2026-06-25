import { Injectable, Logger, NotFoundException } from '@nestjs/common';

// กำหนด Type ของ Function ว่าต้องรับค่า value และคืนค่าเป็น Boolean ว่าผ่าน/ไม่ผ่าน
export type ValidatorFunction = (value: any) => Promise<boolean>;

@Injectable()
export class OptionRegistryService {
    private readonly logger = new Logger(OptionRegistryService.name);

    // สร้าง Map เก็บรายชื่อ Function
    private registry = new Map<string, ValidatorFunction>();

    // Dev จะใช้ Method นี้เพื่อลงทะเบียน Function
    register(name: string, fn: ValidatorFunction) {
        if (this.registry.has(name)) {
            this.logger.warn(
                `Function [${name}] ถูกลงทะเบียนซ้ำ และจะถูกเขียนทับ`,
            );
        }
        this.registry.set(name, fn);
        this.logger.log(`Registered Option Function: ${name}`);
    }

    // ใช้สำหรับเรียก Function ออกมาทำงาน
    async execute(name: string, value: any): Promise<boolean> {
        const fn = this.registry.get(name);
        if (!fn) {
            throw new NotFoundException(
                `ไม่พบ Validator Function ชื่อ: ${name} ในระบบ`,
            );
        }
        return await fn(value);
    }
}
