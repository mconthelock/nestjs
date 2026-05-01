import { Injectable } from '@nestjs/common';
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
}
