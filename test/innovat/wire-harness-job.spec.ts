import { WireHarnessJobService } from 'src/innovat/wire-harness-job/wire-harness-job.service';
import { WireHarnessJobController } from 'src/innovat/wire-harness-job/wire-harness-job.controller';
import { WireHarnessJobRepository } from 'src/innovat/wire-harness-job/wire-harness-job.repository';

describe('WireHarnessJob Module', () => {
    describe('WireHarnessJobService', () => {
        let service: WireHarnessJobService;
        let mockRepo: any;

        beforeEach(() => {
            mockRepo = {
                getProductionPlan: jest.fn(),
                saveProductionPlan: jest.fn(),
            };
            service = new WireHarnessJobService(mockRepo);
        });

        it('should sync production plan from AS400, format fields, and save to repository', async () => {
            const rawAS400Rows = [
                {
                    CTRLNO: ' C01 ',
                    PROCESS: ' B4CC06 ',
                    PROD: ' 2026091 ',
                    P: ' P01 ',
                    SEQBM: ' 1 ',
                    MFGNO: ' M123 ',
                    ITEMNO: ' ITM01 ',
                    PACKNO: ' PK01 ',
                    PROJ: ' PRJ01 ',
                    MODEL: ' MD01 ',
                    PARENT_DRAWING: ' PDWG ',
                    UPPER_DRAWING: ' UDWG ',
                    DRAWING: ' DWG01 ',
                    QTY: ' 10 ',
                    MATERIAL: ' MAT01 ',
                    ITEMCODE: ' F73175 ',
                    CUT: ' 100.5 ',
                    REMARK: ' NOTE ',
                },
            ];

            mockRepo.getProductionPlan.mockResolvedValue(rawAS400Rows);
            mockRepo.saveProductionPlan.mockResolvedValue([]);

            const result = await service.syncProductionPlan();

            expect(mockRepo.getProductionPlan).toHaveBeenCalled();
            expect(mockRepo.saveProductionPlan).toHaveBeenCalledWith([
                {
                    CTRLNO: 'C01',
                    PROCESS: 'B4CC06',
                    PROD: '2026091',
                    P: 'P01',
                    SEQBM: 1,
                    MFGNO: 'M123',
                    ITEMNO: 'ITM01',
                    PACKNO: 'PK01',
                    PROJ: 'PRJ01',
                    MODEL: 'MD01',
                    PARENT_DRAWING: 'PDWG',
                    UPPER_DRAWING: 'UDWG',
                    DRAWING: 'DWG01',
                    QTY: 10,
                    MATERIAL: 'MAT01',
                    ITEMCODE: 'F73175',
                    CUT: 100.5,
                    REMARK: 'NOTE',
                },
            ]);
            expect(result).toEqual({
                total: 1,
                message: 'Sync Production Plan Success',
            });
        });
    });

    describe('WireHarnessJobController', () => {
        let controller: WireHarnessJobController;
        let mockService: any;

        beforeEach(() => {
            mockService = {
                syncProductionPlan: jest.fn(),
            };
            controller = new WireHarnessJobController(mockService);
        });

        it('should call service.syncProductionPlan', async () => {
            mockService.syncProductionPlan.mockResolvedValue({
                total: 5,
                message: 'Sync Production Plan Success',
            });

            const result = await controller.syncProductionPlan();
            expect(mockService.syncProductionPlan).toHaveBeenCalled();
            expect(result.total).toBe(5);
        });
    });

    describe('WireHarnessJobRepository', () => {
        let repository: WireHarnessJobRepository;
        let mockDataSource: any;
        let mockTargetRepo: any;
        let mockAs400: any;

        beforeEach(() => {
            mockTargetRepo = {
                save: jest.fn(),
            };

            mockDataSource = {
                manager: {
                    getRepository: jest.fn().mockReturnValue(mockTargetRepo),
                },
            };

            mockAs400 = {
                runQuery: jest.fn(),
            };

            repository = new WireHarnessJobRepository(mockDataSource, mockAs400);
        });

        it('should call as400.runQuery in getProductionPlan', async () => {
            mockAs400.runQuery.mockResolvedValue([{ CTRLNO: 'C01' }]);
            const res = await repository.getProductionPlan();
            expect(mockAs400.runQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT *'));
            expect(res).toEqual([{ CTRLNO: 'C01' }]);
        });

        it('should save data in saveProductionPlan', async () => {
            const data = [{ CTRLNO: 'C01' }] as any;
            mockTargetRepo.save.mockResolvedValue(data);
            const res = await repository.saveProductionPlan(data);
            expect(mockTargetRepo.save).toHaveBeenCalledWith(data);
            expect(res).toEqual(data);
        });
    });
});
