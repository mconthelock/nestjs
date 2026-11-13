import { CreateFireInspectionDto } from './dto/create-fire-inspection.dto';
import { CreateFireCheckDetailDto } from './dto/create-fire-check-detail.dto';
import { FireRepository } from './fire.repository';
import { FireInspection } from './fire-inspection';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
        private readonly fireRepository: FireRepository,
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

    async createInspection(input: CreateFireInspectionDto) {
        let dto: CreateFireInspectionDto;
        try {
            dto = await validateCheckDto(CreateFireInspectionDto, input);
        } catch {
            throw new BadRequestException('FIRE_INSPECTION_INVALID_DATA');
        }
        const {items, ...headData} = dto;
        const existing = await this.headRepository.findInspectionHead(dto.AREA, dto.FMONTH, dto.FYEAR);
        if (existing) return {status: true, data: {status: 'SKIP', head: existing}};
        const inheritedTransaction = this.headRepository.checkTransactionActive();
        let writesCompleted = false;
        try {
            return await this.headRepository.withCheckTransaction(async () => {
                const duplicate = await this.headRepository.findInspectionHead(dto.AREA, dto.FMONTH, dto.FYEAR);
                if (duplicate) return {status: true, data: {status: 'SKIP', head: duplicate}};
                const normalize = (value: string) => new FireInspection().normalizeCode(value);
                const masters = (await this.fireRepository.allItems(true)).filter(item => item.AREA === dto.AREA);
                const expected = new Map(masters.map(item => [normalize(item.FIRE_CODE), item]));
                const codes = items.map(item => normalize(item.FIRE_CODE));
                if (dto.AREA === 'UNKNOWN' || !expected.size || items.length !== expected.size || new Set(codes).size !== codes.length || codes.some(code => !expected.has(code))) {
                    throw new BadRequestException('FIRE_INSPECTION_MASTER_CHANGED');
                }
                const details = [];
                for (const [index, item] of items.entries()) {
                    const master = expected.get(codes[index]);
                    const type = normalize(master.FTYPE ?? '').toUpperCase();
                    if (!['DRY', 'CO2', 'ABFFC'].includes(type) || (type === 'CO2' ? item.GAGE != null : item.WEIGHT != null)) {
                        throw new BadRequestException('FIRE_INSPECTION_INVALID_DATA');
                    }
                    let detail: CreateFireCheckDetailDto;
                    try {
                        detail = await validateCheckDto(CreateFireCheckDetailDto, {
                            ...item, ...headData, ID: index + 1, FIRE_CODE: master.FIRE_CODE,
                        });
                    } catch {
                        throw new BadRequestException('FIRE_INSPECTION_INVALID_DATA');
                    }
                    if (!detail.CHECK_DATE || detail.CHECK_DATE.slice(0, 7) !== `${dto.FYEAR}-${dto.FMONTH}`) {
                        throw new BadRequestException('FIRE_INSPECTION_INVALID_DATA');
                    }
                    const {AREA, FMONTH, FYEAR, ...key} = headData;
                    details.push({...item, ...key, ID:index + 1, FIRE_CODE:master.FIRE_CODE, CHECK_DATE:new Date(detail.CHECK_DATE)});
                }
                const head = await this.headRepository.createCheckHead(headData);
                await this.detailRepository.createCheckDetails(details);
                writesCompleted = true;
                return {status:true, data:{status:'CREATED', head, detail_count:details.length}};
            });
        } catch (error) {
            // Let an owning caller roll back its transaction; never claim rollback early.
            if (inheritedTransaction) throw error;
            if (error instanceof BadRequestException) throw error;
            const driver = error?.driverError ?? error;
            if (driver?.errorNum === 1 || driver?.code === 'ORA-00001') {
                const duplicate = await this.headRepository.findInspectionHead(dto.AREA, dto.FMONTH, dto.FYEAR);
                if (duplicate) return {status:true, data:{status:'SKIP', head:duplicate}};
            }
            // A failed commit response is ambiguous; do not authorize Form/Flow cleanup.
            if (writesCompleted) throw new InternalServerErrorException('FIRE_INSPECTION_SAVE_UNCONFIRMED');
            throw new InternalServerErrorException('FIRE_INSPECTION_SAVE_ROLLED_BACK');
        }
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
