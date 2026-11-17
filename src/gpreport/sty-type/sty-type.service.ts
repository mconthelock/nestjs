import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStyTypeDto } from './dto/create-sty-type.dto';
import { UpdateStyTypeDto } from './dto/update-sty-type.dto';
import { StyTypeRepository } from './sty-type.repository';

@Injectable()
export class StyTypeService {
    constructor(private readonly repo: StyTypeRepository) {}

    async findByTypeCode(typecode: string) {
        try {
            const res = await this.repo.findByTypeCode(typecode);
            if (res.length === 0) {
                return {
                    status: false,
                    message: 'No data found for the provided type code',
                    data: null,
                };
            }
            return {
                status: true,
                message: 'Data retrieved successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to find by type code: ${error.message}`);
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-11-17
     * @description ดึงข้อมูลประเภทตามรหัสที่ระบุ
     * @returns  ข้อมูลประเภทที่ตรงกับรหัสที่ระบุ หรือข้อผิดพลาดหากไม่พบข้อมูล
     */
    async findOneByCode(code: string) {
        try {
            const res = await this.repo.findOneByCode(code);
            if (!res) {
                throw new NotFoundException(`Type not found for code ${code}`);
            }
            return {
                status: true,
                message: 'Data retrieved successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(error);
        }
    }
}
