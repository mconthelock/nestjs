import { Test, TestingModule } from '@nestjs/testing';
import { S011mpService } from './s011mp.service';
import { S011mpRepository } from './s011mp.repository';
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
            const data= [
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
                }
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
    })
});
