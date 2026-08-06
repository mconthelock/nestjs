import { Injectable } from '@nestjs/common';
import { SendVgmMeltRepository } from '../send-vgm-melt.repository';

@Injectable()
export class SendVgmMeltService {
    constructor(private readonly repo: SendVgmMeltRepository) {}

    async getList(vanndate: string) {
        try {
            const res = await this.repo.getList(vanndate);
            if (res.length === 0) {
                return {
                    status: false,
                    message: 'No data found',
                };
            }
            return {
                status: true,
                message: `Data found ${res.length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to get send VGM melt list: ${error.message}`,
            );
        }
    }
}
