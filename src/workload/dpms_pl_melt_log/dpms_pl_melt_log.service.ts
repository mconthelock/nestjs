import { Injectable } from '@nestjs/common';
import { CreateDpmsPlMeltLogDto } from './dto/create-dpms_pl_melt_log.dto';
import { DpmsPlMeltLogRepository } from './dpms_pl_melt_log.repository';

@Injectable()
export class DpmsPlMeltLogService {
    constructor(private readonly repo: DpmsPlMeltLogRepository) {}

    async create(dto: CreateDpmsPlMeltLogDto | CreateDpmsPlMeltLogDto[]) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                return {
                    status: false,
                    message: 'Save DPMS PL melt log failed',
                };
            }
            return {
                status: true,
                message: 'DPMS PL melt log added successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

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
                `Failed to get DPMS PL melt log list: ${error.message}`,
            );
        }
    }
}
