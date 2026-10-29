import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { transactionContext } from 'src/common/interceptors/transaction-context';
import { AutoInsertAdjustDto } from './dto/auto-insert-adjust.dto';
import { OrderKeyDto } from './dto/ps-adj.dto';
import { PsAdjRepository } from './ps-adj.repository';
import { PsAdjService } from './ps-adj.service';

export interface AutoAdjustResult {
    status: true | 'skipped';
    data?: OrderKeyDto;
    reason?: string;
}
export interface AutoAdjustBatchResult {
    total: number;
    created: number;
    skipped: number;
    failed: number;
    items: {
        index: number;
        DWGNO: string;
        status: 'created' | 'skipped' | 'failed';
        data?: OrderKeyDto;
        reason?: string;
        message?: string;
    }[];
}

@Injectable()
export class PsAdjAutoService {
    constructor(
        @InjectDataSource('webformConnection') private readonly ds: DataSource,
        private readonly forms: FormCreateService,
        private readonly adjust: PsAdjService,
        private readonly repo: PsAdjRepository,
    ) {}

    auto_insert_adjust(
        dto: AutoInsertAdjustDto,
        ip: string,
    ): Promise<AutoAdjustResult>;
    auto_insert_adjust(
        dto: AutoInsertAdjustDto[],
        ip: string,
    ): Promise<AutoAdjustBatchResult>;
    auto_insert_adjust(
        dto: AutoInsertAdjustDto | AutoInsertAdjustDto[],
        ip: string,
    ): Promise<AutoAdjustResult | AutoAdjustBatchResult>;
    async auto_insert_adjust(
        dto: AutoInsertAdjustDto | AutoInsertAdjustDto[],
        ip: string,
    ): Promise<AutoAdjustResult | AutoAdjustBatchResult> {
        if (!Array.isArray(dto)) return this.createOne(dto, ip);
        const items: AutoAdjustBatchResult['items'] = [];
        for (let index = 0; index < dto.length; index++) {
            const item = dto[index];
            try {
                const result = await this.createOne(item, ip);
                items.push({
                    index,
                    DWGNO: item.DWGNO,
                    ...result,
                    status: result.status === 'skipped' ? 'skipped' : 'created',
                });
            } catch (error) {
                items.push({
                    index,
                    DWGNO: item.DWGNO,
                    status: 'failed',
                    message: error.message,
                });
            }
        }
        return {
            total: items.length,
            created: items.filter((i) => i.status === 'created').length,
            skipped: items.filter((i) => i.status === 'skipped').length,
            failed: items.filter((i) => i.status === 'failed').length,
            items,
        };
    }

    private async createOne(
        dto: AutoInsertAdjustDto,
        ip: string,
    ): Promise<AutoAdjustResult> {
        return this.ds.transaction((manager) =>
            transactionContext.run({ manager }, async () => {
                // FormCreateService allocates MAX(NRUNNO) + 1, as in jig auto-inspection.
                await manager.query(
                    'LOCK TABLE WEBFORM.FORM IN SHARE ROW EXCLUSIVE MODE',
                );
                // Serialize check-and-insert with all writers, including insert_adjust.
                await manager.query(
                    'LOCK TABLE WEBFORM.ADJORDREQ IN SHARE ROW EXCLUSIVE MODE',
                );
                if (await this.repo.existsByDrawing(dto.DWGNO)) {
                    return {
                        status: 'skipped' as const,
                        reason: 'DWGNO already exists',
                    };
                }
                const { REQBY, INPUTBY, ...order } = dto;
                const created = await this.forms.create(
                    {
                        NFRMNO: dto.NFRMNO,
                        VORGNO: dto.VORGNO,
                        CYEAR: dto.CYEAR,
                        REQBY,
                        INPUTBY,
                    },
                    ip,
                );
                if (!created?.status || !created.data) {
                    throw new InternalServerErrorException(
                        'WEBFORM creation failed',
                    );
                }
                const fields = [
                    'NFRMNO',
                    'VORGNO',
                    'CYEAR',
                    'CYEAR2',
                    'NRUNNO',
                ] as const;
                if (fields.some((field) => created.data[field] == null)) {
                    throw new InternalServerErrorException(
                        'WEBFORM returned an incomplete form key',
                    );
                }
                const data: OrderKeyDto = {
                    NFRMNO: created.data.NFRMNO,
                    VORGNO: created.data.VORGNO,
                    CYEAR: created.data.CYEAR,
                    CYEAR2: created.data.CYEAR2,
                    NRUNNO: created.data.NRUNNO,
                    CNTLNO: dto.CNTLNO,
                };
                await this.adjust.insert_adjust({ ...order, ...data });
                return { status: true as const, data };
            }),
        );
    }
}
