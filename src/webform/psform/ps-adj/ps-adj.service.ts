import {
    Injectable,
    BadRequestException,
    NotFoundException,
    ConflictException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { PsAdjRepository } from './ps-adj.repository';
import {
    ReasonKeyDto,
    CreateReasonDto,
    UpdateReasonDto,
    FindReasonDto,
    OrderKeyDto,
    CreateOrderDto,
    UpdateOrderDto,
    FindOrderDto,
    FileKeyDto,
    CreateFileDto,
    UpdateFileDto,
    FindFileDto,
} from './dto/ps-adj.dto';

@Injectable()
export class PsAdjService {
    constructor(private readonly repo: PsAdjRepository) {}
    private async write<T>(action: () => Promise<T>): Promise<T> {
        try {
            return await action();
        } catch (error) {
            const code = error?.driverError?.errorNum;
            if (code === 1)
                throw new ConflictException('Primary key already exists');
            if (code === 2291)
                throw new UnprocessableEntityException(
                    'Referenced reason or FORM does not exist',
                );
            if (code === 2292)
                throw new ConflictException(
                    'Record is referenced by another record',
                );
            throw error;
        }
    }
    private changed(result: { affected?: number | null }) {
        if (!result.affected) throw new NotFoundException('Record not found');
        return { status: true };
    }
    async createReason(dto: CreateReasonDto) {
        await this.write(() => this.repo.createReason(dto));
        return { status: true };
    }
    findReason(key: FindReasonDto) {
        return this.repo.findReason(key);
    }
    async updateReason(key: ReasonKeyDto, dto: UpdateReasonDto) {
        if (!Object.keys(dto).length)
            throw new BadRequestException('At least one field is required');
        return this.changed(
            await this.write(() => this.repo.updateReason(key, dto)),
        );
    }
    async deleteReason(key: ReasonKeyDto) {
        return this.changed(
            await this.write(() => this.repo.deleteReason(key)),
        );
    }
    async createOrder(dto: CreateOrderDto) {
        await this.write(() => this.repo.createOrder(dto));
        return { status: true };
    }
    findOrder(key: FindOrderDto) {
        return this.repo.findOrder(key);
    }
    async updateOrder(key: OrderKeyDto, dto: UpdateOrderDto) {
        if (!Object.keys(dto).length)
            throw new BadRequestException('At least one field is required');
        return this.changed(
            await this.write(() => this.repo.updateOrder(key, dto)),
        );
    }
    async deleteOrder(key: OrderKeyDto) {
        return this.changed(await this.write(() => this.repo.deleteOrder(key)));
    }
    async createFile(dto: CreateFileDto) {
        await this.write(() => this.repo.createFile(dto));
        return { status: true };
    }
    findFile(key: FindFileDto) {
        return this.repo.findFile(key);
    }
    async updateFile(key: FileKeyDto, dto: UpdateFileDto) {
        if (!Object.keys(dto).length)
            throw new BadRequestException('At least one field is required');
        return this.changed(
            await this.write(() => this.repo.updateFile(key, dto)),
        );
    }
    async deleteFile(key: FileKeyDto) {
        return this.changed(await this.write(() => this.repo.deleteFile(key)));
    }
}
