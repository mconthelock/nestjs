import { Injectable } from '@nestjs/common';
import { MfgFeederRepository } from './mfg-feeder.repository';
import { MfgFeederResponseDto } from './dto/mfg-feeder-response.dto';

@Injectable()
export class MfgFeederService {
    constructor(
        private readonly repo: MfgFeederRepository,
    ) {}

    async getInfo(controlNo: string): Promise<MfgFeederResponseDto> {
        try {
            const res = await this.repo.getInfo(controlNo);
            if (!res) {
                return {
                    status: 'ERROR',
                    message: 'ID-Tag not found',
                    data: null
                };
            }

            return {
                status: 'SUCCESS',
                message: null,
                data: {
                    INSDATE: res.INSDATE,
                    PROD: res.PROD,
                    MODEL: res.MODEL
                }
            };

        } catch (error) {
            return {
                status: 'ERROR',
                message: error.message || 'Get ID-Tag Failed',
                data: null
            };
        }
    }
}