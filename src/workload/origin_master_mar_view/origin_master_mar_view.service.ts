import { Injectable } from '@nestjs/common';
import { SearchOriginMasterMarViewDto } from './dto/search.dto';
import { OriginMasterMarViewRepository } from './origin_master_mar_view.repository';

@Injectable()
export class OriginMasterMarViewService {
    constructor(private readonly repo: OriginMasterMarViewRepository) {}
    async getOriginMasterMarView(dto: SearchOriginMasterMarViewDto[]) {
        try {
            const result = await this.repo.find(dto);
            if(result.length === 0) {
                return {
                    status: false,
                    message: 'Data not found',
                }
            }
            return {
                status: true,
                message: `Data found ${result.length} records`,
                data: result,
            }
        } catch (error) {
            throw error;
        }
    }
}
