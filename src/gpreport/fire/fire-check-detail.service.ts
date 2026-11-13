import { Injectable, NotFoundException } from '@nestjs/common';
import { FireCheckDetail } from 'src/common/Entities/gpreport/table/FIRE_CHECK_DETAIL.entity';
import { FireCheckDetailRepository } from './fire-check-detail.repository';
import { FireCheckHeadRepository } from './fire-check-head.repository';
import { CreateFireCheckDetailDto } from './dto/create-fire-check-detail.dto';
import { UpdateFireCheckDetailDto } from './dto/update-fire-check-detail.dto';
import { SearchFireCheckDetailDto } from './dto/search-fire-check-detail.dto';
import { FireCheckDetailKeyDto, FireCheckHeadKeyDto } from './dto/fire-check-key.dto';
import { validateCheckDto, validateCheckPagination, requireCheckChanges, checkOperation } from './fire-check.utils';

@Injectable()
export class FireCheckDetailService {
    constructor(
        private readonly detailRepository: FireCheckDetailRepository,
        private readonly headRepository: FireCheckHeadRepository,
    ) {}

    async searchCheckDetails(input: SearchFireCheckDetailDto) {
        const query = await validateCheckDto(SearchFireCheckDetailDto, input);
        validateCheckPagination(query);
        return checkOperation(() => this.detailRepository.searchCheckDetails(query));
    }

    async findCheckDetail(input: FireCheckDetailKeyDto) {
        const key = await validateCheckDto(FireCheckDetailKeyDto, input);
        return checkOperation(async () => {
            const detail = await this.detailRepository.findCheckDetail(key);
            if (!detail) throw new NotFoundException('FIRE_CHECK_DETAIL_NOT_FOUND');
            return detail;
        });
    }

    async createCheckDetail(input: CreateFireCheckDetailDto) {
        const dto = await validateCheckDto(CreateFireCheckDetailDto, input);
        const headKey = await validateCheckDto(FireCheckHeadKeyDto, dto);
        const { CHECK_DATE, ...fields } = dto;
        const data = {
            ...fields,
            ...(CHECK_DATE !== undefined ? { CHECK_DATE: CHECK_DATE === null ? null : new Date(CHECK_DATE) } : {}),
        };
        return checkOperation(() => this.headRepository.withCheckTransaction(async () => {
            if (!await this.headRepository.findCheckHead(headKey, true)) {
                throw new NotFoundException('FIRE_CHECK_HEAD_NOT_FOUND');
            }
            return this.detailRepository.createCheckDetail(data);
        }), 'FIRE_CHECK_DETAIL_ALREADY_EXISTS');
    }

    async updateCheckDetail(input: FireCheckDetailKeyDto, body: UpdateFireCheckDetailDto) {
        const key = await validateCheckDto(FireCheckDetailKeyDto, input);
        const dto = await validateCheckDto(UpdateFireCheckDetailDto, body);
        requireCheckChanges(dto);
        const { CHECK_DATE, ...fields } = dto;
        const data: Partial<FireCheckDetail> = {
            ...fields,
            ...(CHECK_DATE !== undefined ? { CHECK_DATE: CHECK_DATE === null ? null : new Date(CHECK_DATE) } : {}),
        };
        return checkOperation(async () => {
            const result = await this.detailRepository.updateCheckDetail(key, data);
            if (!result.affected) throw new NotFoundException('FIRE_CHECK_DETAIL_NOT_FOUND');
            return this.detailRepository.findCheckDetail(key);
        });
    }

    async removeCheckDetail(input: FireCheckDetailKeyDto) {
        const key = await validateCheckDto(FireCheckDetailKeyDto, input);
        return checkOperation(async () => {
            const result = await this.detailRepository.deleteCheckDetail(key);
            if (!result.affected) throw new NotFoundException('FIRE_CHECK_DETAIL_NOT_FOUND');
            return { message: 'FIRE_CHECK_DETAIL_DELETED', ...key };
        });
    }
}
