import { BadRequestException } from '@nestjs/common';
import {
    AutoInsertTsProcessDto,
    AutoTsProcessItemDto,
    TsDetailDto,
    TsHeaderDto,
} from './dto/ts-process.dto';

const drawingIdentity = (row: AutoTsProcessItemDto) =>
    JSON.stringify([row.DWG, row.GNO, row.LNO, row.ITEM]);

export const processIdentity = (row: AutoTsProcessItemDto) =>
    JSON.stringify([row.DWG, row.GNO, row.LNO, row.PROCID_OLD]);

export function groupTsForms(
    forms: AutoInsertTsProcessDto[],
): AutoInsertTsProcessDto[] {
    const groups = new Map<string, AutoInsertTsProcessDto>();
    for (const form of forms) {
        const key = JSON.stringify([
            form.NFRMNO,
            form.VORGNO,
            form.CYEAR,
            form.REQUEST_BY,
            form.INPUT_BY,
        ]);
        const previous = groups.get(key);
        if (previous) previous.ITEMS.push(...form.ITEMS);
        else groups.set(key, { ...form, ITEMS: [...form.ITEMS] });
    }
    return [...groups.values()];
}

export function buildTsRows(items: AutoTsProcessItemDto[]): {
    HEADERS: TsHeaderDto[];
    DETAILS: TsDetailDto[];
} {
    const HEADERS: TsHeaderDto[] = [];
    const DETAILS: TsDetailDto[] = [];
    const drawings = new Map<string, { SEQ: string; processes: Set<string> }>();
    for (const row of items) {
        const drawingKey = drawingIdentity(row);
        let drawing = drawings.get(drawingKey);
        if (!drawing) {
            if (HEADERS.length >= 999)
                throw new BadRequestException(
                    'A TS form supports at most 999 drawing groups',
                );
            drawing = {
                SEQ: String(HEADERS.length + 1).padStart(3, '0'),
                processes: new Set(),
            };
            drawings.set(drawingKey, drawing);
            HEADERS.push({
                SEQ: drawing.SEQ,
                DWGNO: row.DWG,
                GNO: row.GNO,
                LNO: row.LNO,
                ITEMNO: row.ITEM,
            });
        }
        if (drawing.processes.has(row.PROCID)) {
            throw new BadRequestException(
                `Duplicate new PROCID ${row.PROCID} within drawing group ${drawing.SEQ}`,
            );
        }
        if (drawing.processes.size >= 99)
            throw new BadRequestException(
                'A drawing group supports at most 99 processes',
            );
        drawing.processes.add(row.PROCID);
        const { ITEM, ...detail } = row;
        DETAILS.push({
            ...detail,
            SEQ: drawing.SEQ,
            SEQ_PROC: String(drawing.processes.size).padStart(2, '0'),
        });
    }
    return { HEADERS, DETAILS };
}
