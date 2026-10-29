import {
    buildTsRows,
    groupTsForms,
    processIdentity,
} from './ts-process-auto.utils';

const row = (values = {}) => ({
    DWG: 'DWG000001',
    GNO: '001',
    LNO: '001',
    ITEM: '001',
    PROCID_OLD: 'OLD001',
    TP_OLD: '10',
    TC_OLD: '20',
    PROCID: 'NEW001',
    TP: '11',
    TC: '21',
    ...values,
});
const form = (values = {}) => ({
    NFRMNO: 31,
    VORGNO: '051401',
    CYEAR: '26',
    REQUEST_BY: '12345',
    INPUT_BY: '23456',
    ITEMS: [row()],
    ...values,
});

describe('TS automatic grouping and sequence allocation', () => {
    it('treats empty, whitespace, null and omitted GNO/LNO as the same drawing and process', () => {
        const empty = row({ GNO: '', LNO: '' });
        for (const value of ['   ', null, undefined]) {
            expect(processIdentity(row({ GNO: value, LNO: value }))).toEqual(
                processIdentity(empty),
            );
        }
        const result = buildTsRows([
            empty,
            row({
                GNO: null,
                LNO: undefined,
                PROCID_OLD: 'OLD002',
                PROCID: 'NEW002',
            }),
        ]);
        expect(result.HEADERS).toHaveLength(1);
        expect(result.HEADERS[0]).toMatchObject({ GNO: null, LNO: null });
        expect(
            result.DETAILS.map((detail) => [
                detail.GNO,
                detail.LNO,
                detail.SEQ_PROC,
            ]),
        ).toEqual([
            [null, null, '01'],
            [null, null, '02'],
        ]);
    });
    it('groups repeated form identities while preserving item order', () => {
        const groups = groupTsForms([
            form(),
            form({ ITEMS: [row({ PROCID_OLD: 'OLD002' })] }),
            form({ REQUEST_BY: '99999' }),
        ]);
        expect(groups).toHaveLength(2);
        expect(groups[0].ITEMS.map((item) => item.PROCID_OLD)).toEqual([
            'OLD001',
            'OLD002',
        ]);
        expect(groups[1].REQUEST_BY).toBe('99999');
    });
    it('creates a header per drawing tuple and restarts process sequence per header', () => {
        const result = buildTsRows([
            row(),
            row({ PROCID_OLD: 'OLD002', PROCID: 'NEW002' }),
            row({ DWG: 'DWG000002' }),
            row({ ITEM: '002' }),
        ]);
        expect(result.HEADERS).toEqual([
            {
                SEQ: '001',
                DWGNO: 'DWG000001',
                GNO: '001',
                LNO: '001',
                ITEMNO: '001',
            },
            {
                SEQ: '002',
                DWGNO: 'DWG000002',
                GNO: '001',
                LNO: '001',
                ITEMNO: '001',
            },
            {
                SEQ: '003',
                DWGNO: 'DWG000001',
                GNO: '001',
                LNO: '001',
                ITEMNO: '002',
            },
        ]);
        expect(
            result.DETAILS.map(({ SEQ, SEQ_PROC }) => [SEQ, SEQ_PROC]),
        ).toEqual([
            ['001', '01'],
            ['001', '02'],
            ['002', '01'],
            ['003', '01'],
        ]);
        expect(result.DETAILS[0]).toMatchObject({
            DWG: 'DWG000001',
            GNO: '001',
            LNO: '001',
            PROCID_OLD: 'OLD001',
            TP: '11',
        });
        expect(result.DETAILS[0]).not.toHaveProperty('ITEM');
    });
    it('ignores ITEM and new process but distinguishes old process in duplicate identity', () => {
        expect(processIdentity(row())).toEqual(
            processIdentity(row({ ITEM: '002' })),
        );
        expect(processIdentity(row())).not.toEqual(
            processIdentity(row({ PROCID_OLD: 'OLD002' })),
        );
        expect(processIdentity(row())).toEqual(
            processIdentity(row({ PROCID: 'OTHER' })),
        );
    });
    it('rejects a new PROCID collision before inserting a form', () => {
        expect(() =>
            buildTsRows([row(), row({ PROCID_OLD: 'OLD002' })]),
        ).toThrow('PROCID');
    });
    it('rejects sequence overflow rather than truncating values', () => {
        expect(() =>
            buildTsRows(
                Array.from({ length: 100 }, (_, index) =>
                    row({
                        PROCID_OLD: `O${index}`,
                        PROCID: `N${index}`,
                    }),
                ),
            ),
        ).toThrow('99');
        expect(() =>
            buildTsRows(
                Array.from({ length: 1000 }, (_, index) =>
                    row({
                        ITEM: String(index),
                    }),
                ),
            ),
        ).toThrow('999');
    });
});
