import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ScrapDrumDto } from 'src/innovat/wire-harness-drum-stock/dto/scrap-drum.dto';
import { WireHarnessDrumStockService } from 'src/innovat/wire-harness-drum-stock/wire-harness-drum-stock.service';
import { WireHarnessDrumStockController } from 'src/innovat/wire-harness-drum-stock/wire-harness-drum-stock.controller';
import { WireHarnessDrumStockRepository } from 'src/innovat/wire-harness-drum-stock/wire-harness-drum-stock.repository';

describe('WireHarnessDrumStock Module', () => {
    describe('ScrapDrumDto Validation', () => {
        it('should validate ScrapDrumDto with valid properties', async () => {
            const dto = plainToInstance(ScrapDrumDto, {
                empNo: '15234',
                itemCode: 'F73175',
                prodNo: '2026101',
                drumId: 1,
            });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should fail validation with invalid drumId or empty string', async () => {
            const dto = plainToInstance(ScrapDrumDto, {
                empNo: '',
                itemCode: '',
                prodNo: '',
                drumId: 'one' as any,
            });
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    describe('WireHarnessDrumStockService', () => {
        let service: WireHarnessDrumStockService;
        let mockRepo: any;

        beforeEach(() => {
            mockRepo = {
                list: jest.fn(),
                scrapDrum: jest.fn(),
                selectDrum: jest.fn(),
            };
            service = new WireHarnessDrumStockService(mockRepo);
        });

        it('should get stock list', async () => {
            const condition: FiltersDto = {};
            mockRepo.list.mockResolvedValue([{ ITEMCODE: 'F73175', LENREMAIN: 200 }]);

            const result = await service.list(condition);
            expect(mockRepo.list).toHaveBeenCalledWith(condition);
            expect(result).toEqual([{ ITEMCODE: 'F73175', LENREMAIN: 200 }]);
        });

        it('should scrap drum', async () => {
            const dto: ScrapDrumDto = {
                empNo: '15234',
                itemCode: 'F73175',
                prodNo: '2026101',
                drumId: 1,
            };
            mockRepo.scrapDrum.mockResolvedValue({ affected: 1 });

            const result = await service.scrapDrum(dto);
            expect(mockRepo.scrapDrum).toHaveBeenCalledWith(dto);
            expect(result).toEqual({ affected: 1 });
        });

        it('should select drum', async () => {
            const condition: FiltersDto = {};
            mockRepo.selectDrum.mockResolvedValue({ CTRLNO: 'C01', RN: 1 });

            const result = await service.selectDrum(condition);
            expect(mockRepo.selectDrum).toHaveBeenCalledWith(condition);
            expect(result).toEqual({ CTRLNO: 'C01', RN: 1 });
        });
    });

    describe('WireHarnessDrumStockController', () => {
        let controller: WireHarnessDrumStockController;
        let mockService: any;

        beforeEach(() => {
            mockService = {
                list: jest.fn(),
                scrapDrum: jest.fn(),
                selectDrum: jest.fn(),
            };
            controller = new WireHarnessDrumStockController(mockService);
        });

        it('should delegate list to service', async () => {
            const condition: FiltersDto = {};
            mockService.list.mockResolvedValue([]);
            const result = await controller.list(condition);
            expect(mockService.list).toHaveBeenCalledWith(condition);
            expect(result).toEqual([]);
        });

        it('should delegate scrapDrum to service', async () => {
            const dto: ScrapDrumDto = {
                empNo: '15234',
                itemCode: 'F73175',
                prodNo: '2026101',
                drumId: 1,
            };
            mockService.scrapDrum.mockResolvedValue({ affected: 1 });
            const result = await controller.scrapDrum(dto);
            expect(mockService.scrapDrum).toHaveBeenCalledWith(dto);
            expect(result).toEqual({ affected: 1 });
        });

        it('should delegate selectDrum to service', async () => {
            const condition: FiltersDto = {};
            mockService.selectDrum.mockResolvedValue({ CTRLNO: 'C01' });
            const result = await controller.selectDrum(condition);
            expect(mockService.selectDrum).toHaveBeenCalledWith(condition);
            expect(result).toEqual({ CTRLNO: 'C01' });
        });
    });

    describe('WireHarnessDrumStockRepository', () => {
        let repository: WireHarnessDrumStockRepository;
        let mockDataSource: any;
        let mockTargetRepo: any;
        let mockQb: any;

        beforeEach(() => {
            mockQb = {
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                addOrderBy: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue([]),
                getOne: jest.fn().mockResolvedValue(null),
            };

            mockTargetRepo = {
                createQueryBuilder: jest.fn().mockReturnValue(mockQb),
                update: jest.fn().mockResolvedValue({ affected: 1 }),
            };

            mockDataSource = {
                manager: {
                    getRepository: jest.fn().mockReturnValue(mockTargetRepo),
                },
            };

            repository = new WireHarnessDrumStockRepository(mockDataSource);
        });

        it('should query list with proper order clauses', async () => {
            mockQb.getMany.mockResolvedValue([{ ITEMCODE: 'F73175' }]);
            const res = await repository.list({});
            expect(mockQb.orderBy).toHaveBeenCalledWith('A.LENREMAIN', 'ASC');
            expect(mockQb.addOrderBy).toHaveBeenCalledWith('A.PRODNO', 'ASC');
            expect(mockQb.addOrderBy).toHaveBeenCalledWith('A.DRUMID', 'ASC');
            expect(res).toEqual([{ ITEMCODE: 'F73175' }]);
        });

        it('should update ST_DRUMTYPE to 3 when scrapDrum is called', async () => {
            const dto: ScrapDrumDto = {
                empNo: '15234',
                itemCode: 'F73175',
                prodNo: '2026101',
                drumId: 1,
            };

            const res = await repository.scrapDrum(dto);

            expect(mockTargetRepo.update).toHaveBeenCalledWith(
                {
                    ST_ITEMCODE: 'F73175',
                    ST_PROD: '2026101',
                    ST_ID: 1,
                },
                expect.objectContaining({
                    ST_DRUMTYPE: 3,
                    ST_USERUPDATE: '15234',
                }),
            );
            expect(res).toEqual({ affected: 1 });
        });

        it('should selectDrum using getOne()', async () => {
            mockQb.getOne.mockResolvedValue({ CTRLNO: 'C01', RN: 1 });
            const res = await repository.selectDrum({});
            expect(mockQb.getOne).toHaveBeenCalled();
            expect(res).toEqual({ CTRLNO: 'C01', RN: 1 });
        });
    });
});
