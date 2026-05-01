import { Injectable } from '@nestjs/common';
import { CreateStyItemDto } from './dto/create-sty-item.dto';
import { UpdateStyItemDto } from './dto/update-sty-item.dto';
import { StyItemsRepository } from './sty-items.repository';

@Injectable()
export class StyItemsService {
    constructor(private readonly repo: StyItemsRepository) {}

    async getItemByTypecode(typecode: string) {
        try {
            const res = await this.repo.getItemByTypecode(typecode);
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
