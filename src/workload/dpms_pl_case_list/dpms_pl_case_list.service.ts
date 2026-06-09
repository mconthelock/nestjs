import { Injectable } from '@nestjs/common';
import { CreateDpmsPlCaseListDto } from './dto/create-dpms_pl_case_list.dto';
import { UpdateDpmsPlCaseListDto } from './dto/update-dpms_pl_case_list.dto';
import { DpmsPlCaseListRepository } from './dpms_pl_case_list.repository';

@Injectable()
export class DpmsPlCaseListService {
    constructor(private readonly repo: DpmsPlCaseListRepository) {}
    async create(dto: CreateDpmsPlCaseListDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                return {
                    status: false,
                    message: 'Failed to create DPMS PL Case List',
                };
            }
            return {
                status: true,
                message: 'DPMS PL Case List created successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to create DPMS PL Case List: ${error.message}`,
            );
        }
    }
}
