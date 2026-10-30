import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { IeTsRepository } from './ie-ts.repository';
import {
    AutoInsertTsProcessDto,
    AutoTsProcessItemDto,
    InsertTsProcessDto,
    TsFormKeyDto,
} from './dto/ts-process.dto';
import {
    buildTsRows,
    groupTsForms,
    processIdentity,
} from './ts-process-auto.utils';

export interface AutoTsResult {
    form: {
        NFRMNO: number;
        VORGNO: string;
        CYEAR: string;
        REQUEST_BY: string;
        INPUT_BY: string;
    };
    status: 'created' | 'skipped';
    received: number;
    inserted: number;
    skipped: number;
    key: TsFormKeyDto | null;
}

@Injectable()
export class IeTsService {
    constructor(
        private readonly repo: IeTsRepository,
        private readonly forms: FormCreateService,
    ) {}

    async insert(dto: InsertTsProcessDto) {
        this.validateRows(dto);
        return this.write(() => this.insertRows(dto));
    }

    async autoInsert(dtos: AutoInsertTsProcessDto[], ip: string) {
        if (!dtos.length)
            throw new BadRequestException(
                'At least one form group is required',
            );
        const groups = groupTsForms(dtos);
        return this.write(async () => {
            const seen = new Set<string>();
            const items: AutoTsResult[] = [];
            for (const dto of groups) {
                const retained: AutoTsProcessItemDto[] = [];
                for (const row of dto.ITEMS) {
                    const identity = processIdentity(row);
                    if (seen.has(identity)) continue;
                    seen.add(identity);
                    if (!(await this.repo.processExists(row)))
                        retained.push(row);
                }
                const { NFRMNO, VORGNO, CYEAR, REQUEST_BY, INPUT_BY } = dto;
                const form = { NFRMNO, VORGNO, CYEAR, REQUEST_BY, INPUT_BY };
                if (!retained.length) {
                    items.push({
                        form,
                        status: 'skipped',
                        received: dto.ITEMS.length,
                        inserted: 0,
                        skipped: dto.ITEMS.length,
                        key: null,
                    });
                    continue;
                }
                // Allocate sequences after filtering. Validate PK collisions/limits before creating Form/Flow.
                const rows = buildTsRows(retained);
                const created = await this.forms.create(
                    {
                        NFRMNO,
                        VORGNO,
                        CYEAR,
                        REQBY: REQUEST_BY,
                        INPUTBY: INPUT_BY,
                    },
                    ip,
                );
                const key = created?.data && this.key(created.data);
                if (
                    !created?.status ||
                    !key ||
                    Object.values(key).some((value) => value == null)
                ) {
                    throw new InternalServerErrorException(
                        'Form creation returned an incomplete form key',
                    );
                }
                // Only FORM, FLOW, PROC_TSHEADFORM and PROC_TSDETFORM are inserted in automatic mode.
                await this.insertRows({ ...key, ...rows });
                items.push({
                    form,
                    status: 'created',
                    received: dto.ITEMS.length,
                    inserted: retained.length,
                    skipped: dto.ITEMS.length - retained.length,
                    key,
                });
            }
            return {
                status: true,
                total: groups.length,
                created: items.filter((item) => item.status === 'created')
                    .length,
                skipped: items.filter((item) => item.status === 'skipped')
                    .length,
                items,
            };
        });
    }

    async find(key: TsFormKeyDto) {
        const data = await this.repo.read(key);
        if (!data.HEADERS.length)
            throw new NotFoundException('TS process not found');
        return { status: true, key, data };
    }

    async update(dto: InsertTsProcessDto) {
        this.validateRows(dto);
        return this.write(async () => {
            const key = this.key(dto);
            await this.repo.requireForm(key);
            await this.requireTs(key);
            await this.repo.replace(dto);
            return {
                status: true,
                message: 'Update TS process successfully',
                key,
            };
        });
    }

    remove(key: TsFormKeyDto) {
        return this.write(async () => {
            await this.repo.requireForm(key);
            await this.requireTs(key);
            await this.repo.remove(key);
            return {
                status: true,
                message: 'Delete TS process successfully',
                key,
            };
        });
    }

    private async insertRows(dto: InsertTsProcessDto) {
        const key = this.key(dto);
        await this.repo.requireForm(key);
        if (await this.repo.exists(key))
            throw new ConflictException(
                'TS process already exists; use update_ts_process',
            );
        await this.repo.insert(dto);
        return { status: true, message: 'Insert TS process successfully', key };
    }

    private async requireTs(key: TsFormKeyDto) {
        if (!(await this.repo.exists(key)))
            throw new NotFoundException('TS process not found');
    }

    private validateRows(
        dto: Pick<InsertTsProcessDto, 'HEADERS' | 'DETAILS' | 'FILES'>,
    ) {
        const headers = new Set<string>();
        for (const row of dto.HEADERS) {
            if (headers.has(row.SEQ))
                throw new BadRequestException('Duplicate HEADERS.SEQ');
            headers.add(row.SEQ);
        }
        const details = new Set<string>();
        for (const row of dto.DETAILS ?? []) {
            if (!headers.has(row.SEQ))
                throw new BadRequestException(
                    `DETAILS.SEQ ${row.SEQ} has no matching HEADERS.SEQ`,
                );
            const key = JSON.stringify([row.SEQ, row.PROCID]);
            if (details.has(key))
                throw new BadRequestException('Duplicate DETAILS.SEQ/PROCID');
            details.add(key);
        }
        const files = new Set<number>();
        for (const row of dto.FILES ?? []) {
            if (files.has(row.ID))
                throw new BadRequestException('Duplicate FILES.ID');
            files.add(row.ID);
        }
    }

    private key(dto: TsFormKeyDto): TsFormKeyDto {
        const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO } = dto;
        return { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO };
    }

    private async write<T>(work: () => Promise<T>): Promise<T> {
        try {
            return await this.repo.transaction(async () => {
                // All IE-TS writes share the WEBFORM-owned lock. Cross-schema
                // LOCK TABLE IEDOC.* would require additional Oracle privileges.
                await this.repo.lockFormNumber();
                return work();
            });
        } catch (error) {
            const code = error?.driverError?.errorNum ?? error?.errorNum;
            if (code === 1031) {
                const sql: string = error?.query ?? '';
                const operation = /LOCK TABLE WEBFORM\.FORM/i.test(sql)
                    ? 'lock WEBFORM.FORM'
                    : /PROC_TSHEADFORM/i.test(sql)
                      ? 'access IEDOC.PROC_TSHEADFORM'
                      : /PROC_TSDETFORM/i.test(sql)
                        ? 'access IEDOC.PROC_TSDETFORM'
                        : /PROC_TSATTFILE/i.test(sql)
                          ? 'access IEDOC.PROC_TSATTFILE'
                          : 'create Form/Flow or access TS data';
                throw new InternalServerErrorException(
                    `ORA-01031: webformConnection has insufficient privileges to ${operation}. Check database grants for this connection user.`,
                );
            }
            if (code === 1)
                throw new ConflictException('Duplicate TS process or form key');
            if (code === 2291)
                throw new BadRequestException(
                    'Referenced data not found; check TSFLAG in IEDOC.TSFLAGMST',
                );
            throw error;
        }
    }
}
