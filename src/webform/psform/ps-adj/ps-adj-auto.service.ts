import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { transactionContext } from 'src/common/interceptors/transaction-context';
import { AutoInsertAdjustDto } from './dto/auto-insert-adjust.dto';
import { OrderKeyDto } from './dto/ps-adj.dto';
import { PsAdjService } from './ps-adj.service';

@Injectable()
export class PsAdjAutoService {
    constructor(
        @InjectDataSource('webformConnection') private readonly ds: DataSource,
        private readonly forms: FormCreateService,
        private readonly adjust: PsAdjService,
    ) {}

    async auto_insert_adjust(dto: AutoInsertAdjustDto, ip: string) {
        return this.ds.transaction((manager) =>
            transactionContext.run({ manager }, async () => {
                // FormCreateService allocates MAX(NRUNNO) + 1, as in jig auto-inspection.
                await manager.query('LOCK TABLE WEBFORM.FORM IN SHARE ROW EXCLUSIVE MODE');
                const { REQBY, INPUTBY, ...order } = dto;
                const created = await this.forms.create({
                    NFRMNO: dto.NFRMNO,
                    VORGNO: dto.VORGNO,
                    CYEAR: dto.CYEAR,
                    REQBY,
                    INPUTBY,
                }, ip);
                if (!created?.status || !created.data) {
                    throw new InternalServerErrorException('WEBFORM creation failed');
                }
                const fields = ['NFRMNO', 'VORGNO', 'CYEAR', 'CYEAR2', 'NRUNNO'] as const;
                if (fields.some((field) => created.data[field] == null)) {
                    throw new InternalServerErrorException('WEBFORM returned an incomplete form key');
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
                return { status: true, data };
            }),
        );
    }
}
