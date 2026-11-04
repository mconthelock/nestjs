import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CalculateUsageDto } from 'src/innovat/wire-harness-calculate-usage/dto/calculate-usage.dto';
import { WireHarnessCalculateUsageService } from 'src/innovat/wire-harness-calculate-usage/wire-harness-calculate-usage.service';
import { WireHarnessCalculateUsageController } from 'src/innovat/wire-harness-calculate-usage/wire-harness-calculate-usage.controller';
import { WireHarnessCalculateUsageRepository } from 'src/innovat/wire-harness-calculate-usage/wire-harness-calculate-usage.repository';

describe('WireHarnessCalculateUsage Module', () => {
    describe('CalculateUsageDto Validation', () => {
        it('should pass validation with valid data', async () => {
            const dto = plainToInstance(CalculateUsageDto, {
                groupId: 1,
                prodNoFrom: '2026091',
                prodNoTo: '2026092',
            });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should fail validation with invalid groupId or empty strings', async () => {
            const dto = plainToInstance(CalculateUsageDto, {
                groupId: 'abc' as any,
                prodNoFrom: '',
                prodNoTo: '',
            });
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    describe('WireHarnessCalculateUsageService', () => {
        let service: WireHarnessCalculateUsageService;
        let mockRepo: any;

        beforeEach(() => {
            mockRepo = {
                list: jest.fn(),
            };
            service = new WireHarnessCalculateUsageService(mockRepo);
        });

        it('should call repo.list with given dto and return results', async () => {
            const dto: CalculateUsageDto = {
                groupId: 1,
                prodNoFrom: '2026091',
                prodNoTo: '2026092',
            };
            const mockResult = [
                {
                    ITEMCODE: 'F73175',
                    CABLE: 'EVV25C',
                    LMASTER: 900,
                    QTYL: 1800,
                    QTYDRUM: 2.0,
                },
            ];
            mockRepo.list.mockResolvedValue(mockResult);

            const result = await service.list(dto);
            expect(mockRepo.list).toHaveBeenCalledWith(dto);
            expect(result).toEqual(mockResult);
        });
    });

    describe('WireHarnessCalculateUsageController', () => {
        let controller: WireHarnessCalculateUsageController;
        let mockService: any;

        beforeEach(() => {
            mockService = {
                list: jest.fn(),
            };
            controller = new WireHarnessCalculateUsageController(mockService);
        });

        it('should call service.list and return result', async () => {
            const dto: CalculateUsageDto = {
                groupId: 1,
                prodNoFrom: '2026091',
                prodNoTo: '2026092',
            };
            mockService.list.mockResolvedValue([{ ITEMCODE: 'F73175' }]);

            const result = await controller.list(dto);
            expect(mockService.list).toHaveBeenCalledWith(dto);
            expect(result).toEqual([{ ITEMCODE: 'F73175' }]);
        });
    });

    describe('WireHarnessCalculateUsageRepository', () => {
        let repository: WireHarnessCalculateUsageRepository;
        let mockDataSource: any;
        let mockQb: any;
        let mockTargetRepo: any;

        beforeEach(() => {
            mockQb = {
                select: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
                addGroupBy: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue([]),
            };

            mockTargetRepo = {
                createQueryBuilder: jest.fn().mockReturnValue(mockQb),
            };

            mockDataSource = {
                manager: {
                    getRepository: jest.fn().mockReturnValue(mockTargetRepo),
                },
            };

            repository = new WireHarnessCalculateUsageRepository(mockDataSource);
        });

        it('should build proper query and return calculated usage list', async () => {
            const dto: CalculateUsageDto = {
                groupId: 1,
                prodNoFrom: '2026091',
                prodNoTo: '2026092',
            };
            mockQb.getRawMany.mockResolvedValue([
                {
                    ITEMCODE: 'F73175',
                    CABLE: 'EVV25C',
                    LMASTER: 900,
                    QTYL: 900,
                    QTYDRUM: 1.0,
                },
            ]);

            const result = await repository.list(dto);

            expect(mockTargetRepo.createQueryBuilder).toHaveBeenCalledWith('A');
            expect(mockQb.where).toHaveBeenCalledWith('A.GRPID = :groupId', { groupId: 1 });
            expect(mockQb.andWhere).toHaveBeenCalledWith(
                'A.PRODNO BETWEEN :prodNoFrom AND :prodNoTo',
                {
                    prodNoFrom: '2026091',
                    prodNoTo: '2026092',
                },
            );
            expect(mockQb.groupBy).toHaveBeenCalledWith('A.ITEMCODE');
            expect(mockQb.addGroupBy).toHaveBeenCalledWith('A.CABLE');
            expect(mockQb.addGroupBy).toHaveBeenCalledWith('A.LMASTER');
            expect(mockQb.orderBy).toHaveBeenCalledWith('A.ITEMCODE', 'ASC');
            expect(result).toHaveLength(1);
        });
    });
});
