import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { FireCheckHeadRepository } from './fire-check-head.repository';
import { FireCheckDetailRepository } from './fire-check-detail.repository';
import { CreateFireCheckHeadDto } from './dto/create-fire-check-head.dto';
import { UpdateFireCheckHeadDto } from './dto/update-fire-check-head.dto';
import { SearchFireCheckHeadDto } from './dto/search-fire-check-head.dto';
import { FireCheckHeadKeyDto } from './dto/fire-check-key.dto';
import { validateCheckDto, validateCheckPagination, requireCheckChanges, checkOperation } from './fire-check.utils';

@Injectable()
export class FireCheckHeadService {
    constructor(
        private readonly headRepository: FireCheckHeadRepository,
        private readonly detailRepository: FireCheckDetailRepository,
    ) {}

    async searchCheckHeads(input: SearchFireCheckHeadDto) {
        const query = await validateCheckDto(SearchFireCheckHeadDto, input);
        validateCheckPagination(query);
        return checkOperation(() => this.headRepository.searchCheckHeads(query));
    }

    async findCheckHead(input: FireCheckHeadKeyDto) {
        const key = await validateCheckDto(FireCheckHeadKeyDto, input);
        return checkOperation(async () => {
            const head = await this.headRepository.findCheckHead(key);
            if (!head) throw new NotFoundException('FIRE_CHECK_HEAD_NOT_FOUND');
            return head;
        });
    }

    async createCheckHead(input: CreateFireCheckHeadDto) {
        const data = await validateCheckDto(CreateFireCheckHeadDto, input);
        return checkOperation(
            () => this.headRepository.createCheckHead(data),
            'FIRE_CHECK_HEAD_OR_AREA_MONTH_ALREADY_EXISTS',
        );
    }

    async updateCheckHead(input: FireCheckHeadKeyDto, body: UpdateFireCheckHeadDto) {
        const key = await validateCheckDto(FireCheckHeadKeyDto, input);
        const data = await validateCheckDto(UpdateFireCheckHeadDto, body);
        requireCheckChanges(data);
        return checkOperation(async () => {
            const result = await this.headRepository.updateCheckHead(key, data);
            if (!result.affected) throw new NotFoundException('FIRE_CHECK_HEAD_NOT_FOUND');
            return this.headRepository.findCheckHead(key);
        }, 'FIRE_CHECK_AREA_MONTH_ALREADY_EXISTS');
    }

    async removeCheckHead(input: FireCheckHeadKeyDto) {
        const key = await validateCheckDto(FireCheckHeadKeyDto, input);
        return checkOperation(() => this.headRepository.withCheckTransaction(async () => {
            // Detail inserts take the same parent row lock, so they cannot race
            // this existence check and create an orphan through these endpoints.
            const head = await this.headRepository.findCheckHead(key, true);
            if (!head) throw new NotFoundException('FIRE_CHECK_HEAD_NOT_FOUND');
            if (await this.detailRepository.hasCheckDetails(key)) {
                throw new ConflictException('FIRE_CHECK_HEAD_HAS_DETAILS');
            }
            const result = await this.headRepository.deleteCheckHead(key);
            if (!result.affected) throw new NotFoundException('FIRE_CHECK_HEAD_NOT_FOUND');
            return { message: 'FIRE_CHECK_HEAD_DELETED', ...key };
        }));
    }
}
