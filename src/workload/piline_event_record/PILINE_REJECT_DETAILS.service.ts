import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { RNFRM } from 'src/common/Entities/webform/table/RNFRM.entity';
import { RNLIST } from 'src/common/Entities/webform/table/RNLIST.entity';
import { RNLIST_PP } from 'src/common/Entities/webform/table/RNLIST_PP.entity';
import { RNFRM_PART } from 'src/common/Entities/webform/table/RNFRM_PART.entity';
import { FormDto } from 'src/webform/form/dto/form.dto';

export interface PilineRejectDetails {
    TID: number;
    SECCODE: string;
    CID: number;
    WID: number;
    PRONG: string;
    EXPLAIN: string;
    relatedSectionNames: string[];
    urgent: boolean;
    parts: Array<{
        ORDERNO: string; DWGNO: string; PROJNO: string; PROD: string;
        ITEM: string; PART: string; MODEL: string; QTY: number; REFNO?: string;
    }>;
}

/** Internal writer. The request orchestrator must validate masters and own the transaction.
 * Called by the PI Line request orchestrator, which also updates Flow in this transaction.
 */
@Injectable()
export class PilineRejectDetailsService {
    async insert(manager: EntityManager, key: FormDto, input: PilineRejectDetails) {
        if (!manager.queryRunner?.isTransactionActive) {
            throw new Error('Reject details require an active transaction');
        }
        if (key.NFRMNO !== 4 || key.VORGNO !== '000101' || key.CYEAR !== '18') {
            throw new BadRequestException('Invalid Reject Notice form key');
        }
        if (!input.parts.length || input.parts.some(part => !Number.isSafeInteger(part.QTY) || part.QTY <= 0)) {
            throw new BadRequestException('Parts and positive integer quantities are required');
        }
        // Serializes MAX+1 with inserts, including writers in the existing ASP application.
        await manager.query('LOCK TABLE WEBFORM.RNFRM IN EXCLUSIVE MODE NOWAIT');
        if (await manager.getRepository(RNFRM).existsBy(key)) {
            throw new ConflictException('Reject Notice details already exist for this form');
        }
        const reject = await this.getRejectno(manager, key.CYEAR2, input.TID, input.SECCODE);
        await manager.getRepository(RNFRM).insert({
            ...key, TID: input.TID, SECCODE: input.SECCODE, CID: input.CID,
            WID: input.WID, PRONG: input.PRONG, EXPLAIN: input.EXPLAIN,
            ...reject, STATUS: 'I',
            SECOTH: input.relatedSectionNames.map(name => name.trim()).filter(Boolean).join(', ') || '-',
        });
        const parts = input.parts.map((part, index) => ({
            ...key, ID: index + 1, ORDERNO: part.ORDERNO, DWGNO: part.DWGNO,
            PROJNO: part.PROJNO, PROD: part.PROD, ITEM: part.ITEM, PART: part.PART,
            MODEL: part.MODEL, QTY: part.QTY, REFNO: part.REFNO?.trim() || null,
        }));
        await manager.getRepository(RNLIST).insert(parts);
        await manager.getRepository(RNLIST_PP).insert(parts);
        if ([1, 2].includes(input.WID)) {
            await manager.getRepository(RNFRM_PART).insert({
                CYEAR2: key.CYEAR2, NRUNNO: key.NRUNNO, STATUS: '0', URGENT: input.urgent ? 'Y' : 'W',
            });
        }
        return reject;
    }

    async getRejectno(manager: EntityManager, year: string, tid: number, section: string) {
        const fixed: Record<number, string> = { 4: 'PM', 5: 'PCB', 6: 'MELT', 7: 'ET' };
        let prefix = fixed[tid];
        if (!prefix) {
            const rows = await manager.query('SELECT REJECTNO FROM WEBFORM.SECPIC WHERE SECCODE = :1', [section]);
            const prefixes = [...new Set(rows.map(row => String(row.REJECTNO ?? '').trim()).filter(Boolean))];
            if (prefixes.length !== 1) throw new BadRequestException('Cannot determine REJECTPRE for the responsible section');
            prefix = String(prefixes[0]);
        }
        const rows = await manager.query(
            'SELECT MAX(REJECTNO) AS MAXNO FROM WEBFORM.RNFRM WHERE CYEAR2 = :1 AND REJECTPRE = :2 AND TID = :3',
            [year, prefix, tid],
        );
        // Preserve the historical 2020 starting numbers in rn.inc/getRejectno.
        const starts: Record<number, Record<string, number>> = {
            1: { EWC:8, ELC:7, CEC:6, MP:7, STF:9, STA:13, ESA:2, ESP:8, PM:39,
                TMA:2, MTF:24, MMA:4, PP:6, WHR:3, WHI:2, EKE:7, DES:4, ESE:2,
                IE:3, EKS:2, QA:5, MAR:2, PC:2, PKC:4, ET:107, PCB:9, PUR:2 },
            2: { PP:19, IE:2, DES:2, MP:3, PM:2, ESE:2, ELE:2, STF:3 },
            3: { ESA:2, MTF:2, PM:2, STF:2, MP:3, PP:3, IE:56, ELE:2, EMD:4,
                EAD:6, DES:3, EED:3, ESE:5, ELS:2, QA:8, PUR:2 },
        };
        const max = rows[0]?.MAXNO;
        return { REJECTPRE: prefix, REJECTNO: max == null ? (year === '2020' ? starts[tid]?.[prefix] || 1 : 1) : Number(max) + 1 };
    }
}
