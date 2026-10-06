import { Injectable } from '@nestjs/common';
import { MfgFeederRepository } from './mfg-feeder.repository';
import { MfgFeederResponseDto } from './dto/mfg-feeder-response.dto';
import { GetDrawingBmDto } from './dto/get-drawing-bm.dto';
import { DrawingBMResponseDto } from './dto/drawing-bm-response.dto';

@Injectable()
export class MfgFeederService {
    constructor(
        private readonly repo: MfgFeederRepository,
    ) {}

    async getInfo(
        controlNo: string
    ): Promise<MfgFeederResponseDto> {
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

    async getDrawingBMCount(
        dto: GetDrawingBmDto
    ): Promise<DrawingBMResponseDto> {
        try {
            const res = await this.repo.getDrawingBMCount(dto);
            return {
                status: 'SUCCESS',
                message: null,
                data: {
                    PROD_1: Number(res.PROD_1 ?? 0),
                    PROD_2: Number(res.PROD_2 ?? 0),
                    PROD_3: Number(res.PROD_3 ?? 0),
                    PROD_4: Number(res.PROD_4 ?? 0),
                    PROD_5: Number(res.PROD_5 ?? 0),
                    PROD_6: Number(res.PROD_6 ?? 0)
                }
            };

        } catch (error) {
            return {
                status: 'ERROR',
                message: error.message || 'Get Drawing BM Failed',
                data: null
            };
        }
    }
}