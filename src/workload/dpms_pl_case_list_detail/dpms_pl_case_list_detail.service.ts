import { Injectable } from '@nestjs/common';
import { CreateDpmsPlCaseListDetailDto } from './dto/create-dpms_pl_case_list_detail.dto';
import { UpdateDpmsPlCaseListDetailDto } from './dto/update-dpms_pl_case_list_detail.dto';
import { DpmsPlCaseListDetailRepository } from './dpms_pl_case_list_detail.repository';

@Injectable()
export class DpmsPlCaseListDetailService {
    constructor(private readonly repo: DpmsPlCaseListDetailRepository) {}
    async create(dto: CreateDpmsPlCaseListDetailDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                return {
                    status: false,
                    message: 'Failed to create DPMS PL Case List Detail',
                };
            }
            return {
                status: true,
                message: 'DPMS PL Case List Detail created successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to create DPMS PL Case List Detail: ${error.message}`,
            );
        }
    }
}
