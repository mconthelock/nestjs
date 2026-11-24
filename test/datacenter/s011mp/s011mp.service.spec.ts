import { Test, TestingModule } from '@nestjs/testing';
import { S011mpService } from 'src/datacenter/s011mp/s011mp.service';
import { S011mpRepository } from 'src/datacenter/s011mp/s011mp.repository';
import { S011MP } from 'src/common/Entities/datacenter/table/S011MP.entity';
describe('S011mpService', () => {
    let service: S011mpService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                S011mpService,
                {
                    provide: S011mpRepository,
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<S011mpService>(S011mpService);

        jest.clearAllMocks();
    });

    // =========================
    // Map packing level
    // =========================

    describe('mappingLevel', () => {
        it('should return the quantity differences for the given order', async () => {
            const data = [
                {
                    S11M01: 'EYCC97021',
                    S11M08: '2026071',
                    S11M02: '36601',
                    S11M03: '01',
                    S11M04: 'BA129A389 G02 L12',
                    S11M05: 'CORRIDOR POSITIO',
                    S11M06: 'BA129A389 G02 L12',
                    S11M07: '0',
                    S11M09: 3,
                },
                {
                    S11M01: 'EYCC97021',
                    S11M08: '2026071',
                    S11M02: '36601',
                    S11M03: '01',
                    S11M04: 'BA129A389 G02 L12',
                    S11M05: 'CORRIDOR POSITIO',
                    S11M06: 'BA129A389 G02 L19',
                    S11M07: '1',
                    S11M09: 3,
                },
                {
                    S11M01: 'EYCC97021',
                    S11M08: '2026071',
                    S11M02: '36601',
                    S11M03: '01',
                    S11M04: 'BA129A389 G02 L12',
                    S11M05: 'CORRIDOR POSITIO',
                    S11M06: 'BA129A389 G02 L21',
                    S11M07: '1',
                    S11M09: 3,
                },
                {
                    S11M01: 'EYCC97021',
                    S11M08: '2026071',
                    S11M02: '36601',
                    S11M03: '01',
                    S11M04: 'BA129A389 G02 L12',
                    S11M05: 'CORRIDOR POSITIO',
                    S11M06: 'BA129A389 G02 L25',
                    S11M07: '1',
                    S11M09: 3,
                },
                {
                    S11M01: 'EYCC97021',
                    S11M08: '2026071',
                    S11M02: '36601',
                    S11M03: '01',
                    S11M04: 'BA129A389 G02 L12',
                    S11M05: 'CORRIDOR POSITIO',
                    S11M06: 'BA129A389 G02 L41',
                    S11M07: '1',
                    S11M09: 2,
                },
                {
                    S11M01: 'EYCC97021',
                    S11M08: '2026071',
                    S11M02: '36601',
                    S11M03: '01',
                    S11M04: 'BA129A389 G02 L12',
                    S11M05: 'CORRIDOR POSITIO',
                    S11M06: 'BA129A389 G02 L44',
                    S11M07: '1',
                    S11M09: 1,
                },
                {
                    S11M01: 'EYCC97021',
                    S11M08: '2026071',
                    S11M02: '36601',
                    S11M03: '01',
                    S11M04: 'BA129A389 G02 L12',
                    S11M05: 'CORRIDOR POSITIO',
                    S11M06: 'BA129A389 G02 L51',
                    S11M07: '1',
                    S11M09: 3,
                },
                {
                    S11M01: 'EYCC97021',
                    S11M08: '2026071',
                    S11M02: '36601',
                    S11M03: '01',
                    S11M04: 'BA129A389 G02 L12',
                    S11M05: 'CORRIDOR POSITIO',
                    S11M06: 'BA129A389 G02 L78',
                    S11M07: '1',
                    S11M09: 3,
                },
                {
                    S11M01: 'EYCC97021',
                    S11M08: '2026071',
                    S11M02: '36601',
                    S11M03: '01',
                    S11M04: 'BA129A389 G02 L12',
                    S11M05: 'CORRIDOR POSITIO',
                    S11M06: 'BA129A389 G02 L81',
                    S11M07: '1',
                    S11M09: 3,
                },
            ];

            const result = await service.mappingLevel(data as any);
            expect(result).toEqual([
                {
                    S11M01: 'EYCC97021',
                    S11M08: '2026071',
                    S11M02: '36601',
                    S11M03: '01',
                    S11M04: 'BA129A389 G02 L12',
                    S11M05: 'CORRIDOR POSITIO',
                    S11M06: 'BA129A389 G02 L12',
                    S11M07: '0',
                    S11M09: 2,
                    LEVEL: 'L19L21L25L41L51L78L81',
                    DRAWING_GROUP: 'BA129A389G02',
                    MAXQTY: 3,
                },
                {
                    S11M01: 'EYCC97021',
                    S11M08: '2026071',
                    S11M02: '36601',
                    S11M03: '01',
                    S11M04: 'BA129A389 G02 L12',
                    S11M05: 'CORRIDOR POSITIO',
                    S11M06: 'BA129A389 G02 L12',
                    S11M07: '0',
                    S11M09: 1,
                    LEVEL: 'L19L21L25L44L51L78L81',
                    DRAWING_GROUP: 'BA129A389G02',
                    MAXQTY: 3,
                },
            ]);
        });

        it('splits multiple minimum-quantity levels across the output rows', async () => {
            const main: S011MP = {
                S11M01: 'ETA048243',
                S11M02: '26201',
                S11M03: '01',
                S11M04: 'BE501A752 G03 L21',
                S11M05: 'DOOR',
                S11M06: 'BE501A752 G03 L21',
                S11M07: '0',
                S11M08: '2026112',
                S11M09: 2,
            };
            const levelRows: Array<[string, number]> = [
                ['L26', 2],
                ['L45', 1],
                ['L62', 1],
                ['L78', 2],
                ['L81', 2],
                ['L85', 2],
                ['L42', 1],
                ['L61', 1],
            ];
            const data: S011MP[] = [
                main,
                ...levelRows.map(([level, quantity]) => ({
                    ...main,
                    S11M06: `BE501A752 G03 ${level}`,
                    S11M07: '1',
                    S11M09: quantity,
                })),
            ];

            const result = await service.mappingLevel(data);

            expect(result.map(({ LEVEL }) => LEVEL)).toEqual([
                'L26L45L62L78L81L85',
                'L26L42L61L78L81L85',
            ]);
            expect(result.map(({ S11M09 }) => S11M09)).toEqual([1, 1]);
        });

        it('assigns each of two minimum-quantity levels to a separate row', async () => {
            const main: S011MP = {
                S11M01: 'KA900A101',
                S11M02: 'ITEM',
                S11M03: '01',
                S11M04: 'KA900A101 G01 L21',
                S11M05: 'DOOR',
                S11M06: 'KA900A101 G01 L21',
                S11M07: '0',
                S11M08: '2026112',
                S11M09: 2,
            };
            const levelRows: Array<[string, number]> = [
                ['L26', 2],
                ['L34', 1],
                ['L51', 2],
                ['L81', 2],
                ['L31', 1],
            ];
            const data: S011MP[] = [
                main,
                ...levelRows.map(([level, quantity]) => ({
                    ...main,
                    S11M06: `KA900A101 G01 ${level}`,
                    S11M07: '1',
                    S11M09: quantity,
                })),
            ];

            const result = await service.mappingLevel(data);

            expect(result.map(({ LEVEL }) => LEVEL)).toEqual([
                'L26L34L51L81',
                'L26L31L51L81',
            ]);
        });
    });

    describe('get level', () => {
        it('should return the correct level for given data', () => {
            const drawing = 'BA129A389 G02 L12';
            const result = service.getLevel(drawing);
            expect(result).toBe('L12');
        });
        it('should return the correct level for given space drawing', () => {
            const drawing = 'BA129A389 G02 L12      ';
            const result = service.getLevel(drawing);
            expect(result).toBe('L12');
        });
        it('should return an null for an invalid drawing', () => {
            const drawing = 'INVALID DRAWING';
            const result = service.getLevel(drawing);
            expect(result).toBeNull();
        });
    });

    describe('Test case Data error bm by case', () => {
        it('should return the quantity differences for the given order', async () => {
            const data= [
                {
                    S11M01: 'EXIV53940',
                    S11M08: '2026112',
                    S11M02: '36201',
                    S11M03: '02',
                    S11M04: 'BA131A657 G01 L04',
                    S11M05: 'HALL POSITION IN',
                    S11M06: 'BA131A657 G01 L04',
                    S11M07: '0',
                    S11M09: 2,
                },
                {
                    S11M01: 'EXIV53940',
                    S11M08: '2026112',
                    S11M02: '36201',
                    S11M03: '02',
                    S11M04: 'BA131A657 G01 L04',
                    S11M05: 'HALL POSITION IN',
                    S11M06: 'BA131A657 G01 L22',
                    S11M07: '1',
                    S11M09: 2,
                },
                {
                    S11M01: 'EXIV53940',
                    S11M08: '2026112',
                    S11M02: '36201',
                    S11M03: '02',
                    S11M04: 'BA131A657 G01 L04',
                    S11M05: 'HALL POSITION IN',
                    S11M06: 'BA131A657 G01 L83',
                    S11M07: '1',
                    S11M09: 2,
                },
                {
                    S11M01: 'EXIV53940',
                    S11M08: '2026112',
                    S11M02: '36201',
                    S11M03: '01',
                    S11M04: 'KA510A245 G03 L93',
                    S11M05: 'JAMB ASS\'Y',
                    S11M06: 'KA510A245 G03 L93',
                    S11M07: '0',
                    S11M09: 1,
                },
                {
                    S11M01: 'EXIV53940',
                    S11M08: '2026112',
                    S11M02: '36201',
                    S11M03: '01',
                    S11M04: 'KA510A245 G03 L93',
                    S11M05: 'JAMB ASS\'Y',
                    S11M06: 'KA510A245 G03 L31',
                    S11M07: '1',
                    S11M09: 1,
                },
                {
                    S11M01: 'EXIV53940',
                    S11M08: '2026112',
                    S11M02: '36201',
                    S11M03: '01',
                    S11M04: 'KA510A245 G03 L91',
                    S11M05: 'JAMB ASS\'Y',
                    S11M06: 'KA510A245 G03 L91',
                    S11M07: '0',
                    S11M09: 1,
                },
                {
                    S11M01: 'EXIV53940',
                    S11M08: '2026112',
                    S11M02: '36201',
                    S11M03: '01',
                    S11M04: 'KA510A245 G03 L91',
                    S11M05: 'JAMB ASS\'Y',
                    S11M06: 'KA510A245 G03 L31',
                    S11M07: '1',
                    S11M09: 1,
                },
            ];

            const result = await service.mappingLevel(data as any);
            expect(result).toEqual([
                {
                    S11M01: 'EXIV53940',
                    S11M08: '2026112',
                    S11M02: '36201',
                    S11M03: '02',
                    S11M04: 'BA131A657 G01 L04',
                    S11M05: 'HALL POSITION IN',
                    S11M06: 'BA131A657 G01 L04',
                    S11M07: '0',
                    S11M09: 2,
                    LEVEL: 'L22L83',
                    DRAWING_GROUP: 'BA131A657G01',
                    MAXQTY: 2,
                },
                {
                    S11M01: 'EXIV53940',
                    S11M08: '2026112',
                    S11M02: '36201',
                    S11M03: '01',
                    S11M04: 'KA510A245 G03 L93',
                    S11M05: 'JAMB ASS\'Y',
                    S11M06: 'KA510A245 G03 L93',
                    S11M07: '0',
                    S11M09: 1,
                    LEVEL: 'L31',
                    DRAWING_GROUP: 'KA510A245G03',
                    MAXQTY: 1,
                },
                {
                    S11M01: 'EXIV53940',
                    S11M08: '2026112',
                    S11M02: '36201',
                    S11M03: '01',
                    S11M04: 'KA510A245 G03 L91',
                    S11M05: 'JAMB ASS\'Y',
                    S11M06: 'KA510A245 G03 L91',
                    S11M07: '0',
                    S11M09: 1,
                    LEVEL: 'L31',
                    DRAWING_GROUP: 'KA510A245G03',
                    MAXQTY: 1,
                }
            ]);
        });
    });

});
