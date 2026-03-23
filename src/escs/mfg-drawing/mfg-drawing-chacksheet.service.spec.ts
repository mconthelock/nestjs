import { Test, TestingModule } from '@nestjs/testing';
import { MfgDrawingCreateChecksheetService } from './mfg-drawing-checksheet.service';
import { MfgDrawingService } from './mfg-drawing.service';
import { F110kpService } from 'src/datacenter/f110kp/f110kp.service';
import { F001kpService } from 'src/as400/shopf/f001kp/f001kp.service';
import { IdtagEfacLogService } from 'src/workload/idtag-efac-log/idtag-efac-log.service';
import { S011mpService } from 'src/datacenter/s011mp/s011mp.service';
import { ItemMfgService } from '../item-mfg/item-mfg.service';
import { FileService } from 'src/common/services/file/file.service';
import { MfgSerialService } from '../mfg-serial/mfg-serial.service';
import { MfgDrawingActionService } from '../mfg-drawing-action/mfg-drawing-action.service';
import { GeneralPartListService } from 'src/general-part-list/general-part-list.service';

describe('MfgDrawingCreateChecksheetService', () => {
    let service: MfgDrawingCreateChecksheetService;

    // beforeEach(async () => {
    //     const module: TestingModule = await Test.createTestingModule({
    //         providers: [
    //             MfgDrawingCreateChecksheetService,
    //             { provide: MfgDrawingService, useValue: {} },
    //             { provide: ItemMfgService, useValue: {} },
    //             { provide: IdtagEfacLogService, useValue: {} },
    //             { provide: F110kpService, useValue: {} },
    //             { provide: F001kpService, useValue: {} },
    //             { provide: S011mpService, useValue: {} },
    //             { provide: FileService, useValue: {} },
    //             { provide: MfgSerialService, useValue: {} },
    //             { provide: MfgDrawingActionService, useValue: {} },
    //             { provide: GeneralPartListService, useValue: {} },
    //         ],
    //     }).compile();

    //     service = module.get<MfgDrawingCreateChecksheetService>(
    //         MfgDrawingCreateChecksheetService,
    //     );
    // });
    beforeEach(() => {
        service = new MfgDrawingCreateChecksheetService(
            {} as any, // MfgDrawingService
            {} as any, // ItemMfgService
            {} as any, // IdtagEfacLogService
            {} as any, // F110kpService
            {} as any, // F001kpService
            {} as any, // S011mpService
            {} as any, // FileService
            {} as any, // MfgSerialService
            {} as any, // MfgDrawingActionService
            {} as any, // GeneralPartListService
        );
    });

    // =========================
    // readMaster
    // =========================
    describe('readMaster', () => {
        it('should return only items with NSTATUS = 1', () => {
            const mockList = [
                { NSTATUS: 1, VDRAWING: 'BS123 G01 L01~L02' },
                { NSTATUS: 0, VDRAWING: 'BS999 G02 L01~L02' },
            ];

            const result = service.readMaster(mockList as any);
            expect(result).toHaveLength(1);
        });

        it('should return correctly mapped result', () => {
            const mockList = [
                {
                    NSTATUS: 1,
                    VDRAWING: 'BS123 G01 L01~L02',
                    VNUMBER_FILE: 'file1',
                },
            ];

            const result = service.readMaster(mockList as any);

            expect(result[0]).toEqual({
                VDRAWING: {
                    DRAWING: 'BS123',
                    G: ['G01'],
                    L: [['L01', 'L02']],
                },
                VNUMBER_FILE: 'file1',
            });
        });

        it('should return empty array if no valid items', () => {
            const mockList = [{ NSTATUS: 0, VDRAWING: 'BS999 G02 L01~L02' }];

            const result = service.readMaster(mockList as any);

            expect(result).toEqual([]);
        });
    });

    // =========================
    // splitGPL
    // =========================
    describe('splitGPL', () => {
        it('should split G/L string into array', () => {
            const result = service.splitGPL('G01G05G07L01');
            expect(result).toEqual(['G01', 'G05', 'G07', 'L01']);
        });

        it('should return empty array for empty string', () => {
            const result = service.splitGPL('');
            expect(result).toEqual([]);
        });
    });

    // =========================
    // expandGLRange
    // =========================
    describe('expandGLRange', () => {
        it('should expand L range correctly', () => {
            const result = service.expandGLRange(
                'BS123A571 G01 L01~L04 L12~L14',
            );
            expect(result).toEqual('BS123A571 G01 L01L02L03L04 L12L13L14');
        });
        it('should return single item if no range', () => {
            const result = service.expandGLRange('BS123A571 G01 L01');
            expect(result).toEqual('BS123A571 G01 L01');
        });
    });

    // =========================
    // parseGLSegments
    // =========================
    describe('parseGLSegments', () => {
        it('should parse G and L segments correctly', () => {
            const split = ['BS123A571', 'G05', 'L20L21', 'L50L51L52'];
            const result = service.parseGLSegments(split);

            expect(result).toEqual({
                G: ['G05'],
                L: [
                    ['L20', 'L21'],
                    ['L50', 'L51', 'L52'],
                ],
            });
        });
        it('should return empty arrays if no G or L segments', () => {
            const split = ['BS123A571'];
            const result = service.parseGLSegments(split);
            expect(result).toEqual({
                G: [],
                L: [],
            });
        });
        it('should throw error if multiple G segments found', () => {
            const split = ['BS123A571', 'G05', 'G06', 'L20L21'];
            expect(() => service.parseGLSegments(split)).toThrow(
                'Invalid format: multiple G groups found',
            );
        });
    });

    // =========================
    // explodeGL
    // =========================
    describe('explodeGL', () => {
        it('should parse drawing and G/L correctly', () => {
            const result = service.explodeGL('BS123 G01 L01');

            expect(result).toEqual({
                DRAWING: 'BS123',
                G: ['G01'],
                L: [['L01']],
            });
        });

        it('should expand L range correctly', () => {
            const result = service.explodeGL('BS123 G01 L01~L03');

            expect(result).toEqual({
                DRAWING: 'BS123',
                G: ['G01'],
                L: [['L01', 'L02', 'L03']],
            });
        });

        it('should handle multiple L groups', () => {
            const result = service.explodeGL('BS123 G01 L01~L02 L05');

            expect(result).toEqual({
                DRAWING: 'BS123',
                G: ['G01'],
                L: [['L01', 'L02'], ['L05']],
            });
        });

        it('should throw error when multiple G found', () => {
            expect(() => {
                service.explodeGL('BS123 G01 G02 L01');
            }).toThrow('Invalid format: multiple G groups found');
        });
    });

    // =========================
    // extractDrawing
    // =========================
    describe('extractDrawing', () => {
        it('should return correct data list for given drawing', () => {
            expect(service.extractDrawing('BA105A280 G01L21L85L92')).toEqual([
                'BA105A280',
                'G01',
                'L21',
                'L85',
                'L92',
            ]);
        });
    });

    // =========================
    // getDataListOfCS
    // =========================
    describe('getDataListOfCS', () => {
        it('should return correct data list for given drawing', () => {
            const mockList = [
                {
                    NSTATUS: 1,
                    VDRAWING: 'BA105A280 G01 L20~L25',
                    VNUMBER_FILE: 'file1',
                },
                {
                    NSTATUS: 1,
                    VDRAWING: 'BA105A280 G02 L01',
                    VNUMBER_FILE: 'file3',
                },
            ];
            expect(
                service.getDataListOfCS(
                    mockList as any,
                    'BA105A280 G01L21L85L92',
                ),
            ).toEqual({
                VDRAWING: {
                    DRAWING: 'BA105A280',
                    G: ['G01'],
                    L: [['L20', 'L21', 'L22', 'L23', 'L24', 'L25']],
                },
                VNUMBER_FILE: 'file1',
            });
        });
        it('should return multiple matches', () => {
            const mockList = [
                {
                    NSTATUS: 1,
                    VDRAWING: 'BA105A280 G01 L20~L25',
                    VNUMBER_FILE: 'file1',
                },
                {
                    NSTATUS: 1,
                    VDRAWING: 'BA105A280 G01 L21',
                    VNUMBER_FILE: 'file2',
                },
                {
                    NSTATUS: 1,
                    VDRAWING: 'BA105A280 G02 L01',
                    VNUMBER_FILE: 'file3',
                },
            ];
            expect(() => {
                service.getDataListOfCS(
                    mockList as any,
                    'BA105A280 G01L21L85L92',
                );
            }).toThrow(
                'Multiple matching drawings found in Master for drawing BA105A280 G01L21L85L92',
            );
        });
        it('should throw error if no matches found', () => {
            const mockList = [
                {
                    NSTATUS: 1,
                    VDRAWING: 'BA105A280 G01 L20~L25',
                    VNUMBER_FILE: 'file1',
                },
                {
                    NSTATUS: 1,
                    VDRAWING: 'BA105A280 G02 L01',
                    VNUMBER_FILE: 'file3',
                },
            ];
            expect(() => {
                service.getDataListOfCS(mockList as any, 'BA105A280 G03L01');
            }).toThrow(
                'No matching drawing found in Master for drawing BA105A280 G03L01',
            );
        });
    });

    // =========================
    // checkDeleteDrawing
    // =========================
    describe('checkDeleteDrawing', () => {
        it.each([
            ['drawing is empty', ''],
            ['delete list is empty', 'BA212B768 G01L03', true],
            ['drawing not match', 'KE528C219 G02L01L04'],
            ['missing L', 'BA212B768 G01'],
            ['L not match', 'BA212B768 G01L06'],
            ['drawing is not in delete list', 'BA212B768 G01L06'],
            ['missing G', 'BA212B768 G06'],
        ])('should return false when %s', (_, input, empty = false) => {
            const deleteList = empty ? [] : ['BA212B768 G01 L03~L05'];
            expect(service.checkDeleteDrawing(deleteList, input)).toBe(false);
        });
        it('should return true if drawing is in delete list', () => {
            const deleteList = ['BA212B768 G01 L03~L05'];
            expect(
                service.checkDeleteDrawing(deleteList, 'BA212B768 G01L03'),
            ).toBe(true);
        });
    });
});
