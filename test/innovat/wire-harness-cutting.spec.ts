import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { CreateDrumDto } from 'src/innovat/wire-harness-cutting/dto/create-drum.dto';
import { UpdateDrumDto } from 'src/innovat/wire-harness-cutting/dto/update-drum.dto';
import { DrumToStockDto } from 'src/innovat/wire-harness-cutting/dto/drum-to-stock.dto';
import { WireHarnessCuttingService } from 'src/innovat/wire-harness-cutting/wire-harness-cutting.service';
import { WireHarnessCuttingController } from 'src/innovat/wire-harness-cutting/wire-harness-cutting.controller';
import { WireHarnessCuttingRepository } from 'src/innovat/wire-harness-cutting/wire-harness-cutting.repository';

describe('WireHarnessCutting Module', () => {
    describe('DTO Validation', () => {
        it('should validate CreateDrumDto', async () => {
            const dto = plainToInstance(CreateDrumDto, {
                empNo: '15234',
                itemCode: 'F73175',
                prodNo: '2026091',
                ctrlNo: 'C6071300JC4',
                cut: 100.5,
                cutType: 1,
                reasonId: 2,
            });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate UpdateDrumDto', async () => {
            const dto = plainToInstance(UpdateDrumDto, {
                empNo: '15234',
                itemCode: 'F73175',
                prodNo: '2026091',
                drumId: 1,
                ctrlNo: 'C6071300JC4',
                cut: 50.2,
                cutType: 2,
                reasonId: 1,
            });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate DrumToStockDto', async () => {
            const dto = plainToInstance(DrumToStockDto, {
                empNo: '15234',
                itemCode: 'F73175',
                prodNo: '2026091',
                drumId: 1,
            });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });
    });

    describe('WireHarnessCuttingService', () => {
        let service: WireHarnessCuttingService;
        let mockRepo: any;

        beforeEach(() => {
            mockRepo = {
                getProcess: jest.fn(),
                getProduction: jest.fn(),
                getAutoPlan: jest.fn(),
                createDrum: jest.fn(),
                updateDrum: jest.fn(),
                drumToStock: jest.fn(),
                reason: jest.fn(),
            };
            service = new WireHarnessCuttingService(mockRepo);
        });

        it('should get process list', async () => {
            mockRepo.getProcess.mockResolvedValue([{ PRC_CODE: 'P01' }]);
            const result = await service.process();
            expect(mockRepo.getProcess).toHaveBeenCalled();
            expect(result).toEqual([{ PRC_CODE: 'P01' }]);
        });

        it('should get production list', async () => {
            mockRepo.getProduction.mockResolvedValue([{ PRODNO: '2026091' }]);
            const result = await service.production();
            expect(mockRepo.getProduction).toHaveBeenCalled();
            expect(result).toEqual([{ PRODNO: '2026091' }]);
        });

        it('should get auto plan with filters', async () => {
            const filter: FiltersDto = {
                filters: [{ field: 'PRODNO', op: 'eq', value: '2026091' }],
            };
            mockRepo.getAutoPlan.mockResolvedValue([{ PRODNO: '2026091' }]);
            const result = await service.autoPlan(filter);
            expect(mockRepo.getAutoPlan).toHaveBeenCalledWith(filter);
            expect(result).toEqual([{ PRODNO: '2026091' }]);
        });

        it('should create drum successfully', async () => {
            const dto: CreateDrumDto = {
                empNo: '15234',
                itemCode: 'F73175',
                prodNo: '2026091',
                ctrlNo: 'C6071300JC4',
                cut: 100,
                cutType: 1,
                reasonId: null,
            };
            mockRepo.createDrum.mockResolvedValue({ status: true });
            const result = await service.createDrum(dto);
            expect(mockRepo.createDrum).toHaveBeenCalledWith(dto);
            expect(result).toEqual({ status: true });
        });

        it('should throw BadRequestException and strip ORA- prefix when createDrum fails', async () => {
            const dto: CreateDrumDto = {
                empNo: '15234',
                itemCode: 'F73175',
                prodNo: '2026091',
                ctrlNo: 'C6071300JC4',
                cut: 100,
                cutType: 1,
                reasonId: null,
            };
            mockRepo.createDrum.mockRejectedValue(
                new Error('ORA-20001: Drum length exceeded\nORA-06512: at line 10'),
            );

            await expect(service.createDrum(dto)).rejects.toThrow(BadRequestException);
            await expect(service.createDrum(dto)).rejects.toThrow('Drum length exceeded');
        });

        it('should update drum successfully', async () => {
            const dto: UpdateDrumDto = {
                empNo: '15234',
                itemCode: 'F73175',
                prodNo: '2026091',
                drumId: 1,
                ctrlNo: 'C6071300JC4',
                cut: 50,
                cutType: 2,
                reasonId: null,
            };
            mockRepo.updateDrum.mockResolvedValue({ status: true });
            const result = await service.updateDrum(dto);
            expect(mockRepo.updateDrum).toHaveBeenCalledWith(dto);
            expect(result).toEqual({ status: true });
        });

        it('should throw BadRequestException when updateDrum fails', async () => {
            const dto: UpdateDrumDto = {
                empNo: '15234',
                itemCode: 'F73175',
                prodNo: '2026091',
                drumId: 1,
                ctrlNo: 'C6071300JC4',
                cut: 50,
                cutType: 2,
                reasonId: null,
            };
            mockRepo.updateDrum.mockRejectedValue(
                new Error('ORA-00001: Unique constraint violated\n'),
            );

            await expect(service.updateDrum(dto)).rejects.toThrow(BadRequestException);
            await expect(service.updateDrum(dto)).rejects.toThrow('Unique constraint violated');
        });

        it('should move drum to stock', async () => {
            const dto: DrumToStockDto = {
                empNo: '15234',
                itemCode: 'F73175',
                prodNo: '2026091',
                drumId: 1,
            };
            mockRepo.drumToStock.mockResolvedValue({ status: true });
            const result = await service.drumToStock(dto);
            expect(mockRepo.drumToStock).toHaveBeenCalledWith(dto);
            expect(result).toEqual({ status: true });
        });

        it('should get reason list', async () => {
            const filter: FiltersDto = {};
            mockRepo.reason.mockResolvedValue([{ RS_ID: 1, RS_NAME_TH: 'ทดสอบ' }]);
            const result = await service.reason(filter);
            expect(mockRepo.reason).toHaveBeenCalledWith(filter);
            expect(result).toEqual([{ RS_ID: 1, RS_NAME_TH: 'ทดสอบ' }]);
        });
    });

    describe('WireHarnessCuttingController', () => {
        let controller: WireHarnessCuttingController;
        let mockService: any;

        beforeEach(() => {
            mockService = {
                process: jest.fn(),
                production: jest.fn(),
                autoPlan: jest.fn(),
                createDrum: jest.fn(),
                updateDrum: jest.fn(),
                drumToStock: jest.fn(),
                reason: jest.fn(),
            };
            controller = new WireHarnessCuttingController(mockService);
        });

        it('should delegate process', async () => {
            mockService.process.mockResolvedValue([]);
            const res = await controller.process();
            expect(mockService.process).toHaveBeenCalled();
            expect(res).toEqual([]);
        });

        it('should delegate production', async () => {
            mockService.production.mockResolvedValue([]);
            const res = await controller.production();
            expect(mockService.production).toHaveBeenCalled();
            expect(res).toEqual([]);
        });

        it('should delegate autoPlan', async () => {
            const filter: FiltersDto = {};
            mockService.autoPlan.mockResolvedValue([]);
            const res = await controller.autoPlan(filter);
            expect(mockService.autoPlan).toHaveBeenCalledWith(filter);
            expect(res).toEqual([]);
        });

        it('should delegate createDrum', async () => {
            const dto = { empNo: '15234' } as CreateDrumDto;
            mockService.createDrum.mockResolvedValue({ status: true });
            const res = await controller.createDrum(dto);
            expect(mockService.createDrum).toHaveBeenCalledWith(dto);
            expect(res).toEqual({ status: true });
        });

        it('should delegate updateDrum', async () => {
            const dto = { empNo: '15234' } as UpdateDrumDto;
            mockService.updateDrum.mockResolvedValue({ status: true });
            const res = await controller.updateDrum(dto);
            expect(mockService.updateDrum).toHaveBeenCalledWith(dto);
            expect(res).toEqual({ status: true });
        });

        it('should delegate drumToStock', async () => {
            const dto = { empNo: '15234' } as DrumToStockDto;
            mockService.drumToStock.mockResolvedValue({ status: true });
            const res = await controller.drumToStock(dto);
            expect(mockService.drumToStock).toHaveBeenCalledWith(dto);
            expect(res).toEqual({ status: true });
        });

        it('should delegate reason', async () => {
            const filter: FiltersDto = {};
            mockService.reason.mockResolvedValue([]);
            const res = await controller.reason(filter);
            expect(mockService.reason).toHaveBeenCalledWith(filter);
            expect(res).toEqual([]);
        });
    });

    describe('WireHarnessCuttingRepository', () => {
        let repository: WireHarnessCuttingRepository;
        let mockDataSource: any;
        let mockTargetRepo: any;

        beforeEach(() => {
            mockTargetRepo = {
                find: jest.fn(),
                save: jest.fn(),
                createQueryBuilder: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnThis(),
                    andWhere: jest.fn().mockReturnThis(),
                    orderBy: jest.fn().mockReturnThis(),
                    addOrderBy: jest.fn().mockReturnThis(),
                    getMany: jest.fn().mockResolvedValue([]),
                }),
            };

            mockDataSource = {
                manager: {
                    getRepository: jest.fn().mockReturnValue(mockTargetRepo),
                },
            };

            repository = new WireHarnessCuttingRepository(mockDataSource);
        });

        it('should get process ordered by PRC_CODE', async () => {
            mockTargetRepo.find.mockResolvedValue([{ PRC_CODE: '01' }]);
            const res = await repository.getProcess();
            expect(mockTargetRepo.find).toHaveBeenCalledWith({
                order: { PRC_CODE: 'ASC' },
            });
            expect(res).toEqual([{ PRC_CODE: '01' }]);
        });

        it('should get production ordered by PRODNO', async () => {
            mockTargetRepo.find.mockResolvedValue([{ PRODNO: '2026091' }]);
            const res = await repository.getProduction();
            expect(mockTargetRepo.find).toHaveBeenCalledWith({
                order: { PRODNO: 'ASC' },
            });
            expect(res).toEqual([{ PRODNO: '2026091' }]);
        });

        it('should save production plan', async () => {
            const data = [{ CTRLNO: 'C01' }];
            mockTargetRepo.save.mockResolvedValue(data);
            const res = await repository.saveProductionPlan(data);
            expect(mockTargetRepo.save).toHaveBeenCalledWith(data);
            expect(res).toEqual(data);
        });

        it('should call oracle execCursor on createDrum', async () => {
            const dto: CreateDrumDto = {
                empNo: '15234',
                itemCode: 'F73175',
                prodNo: '2026091',
                ctrlNo: 'C01',
                cut: 100,
                cutType: 1,
                reasonId: null,
            };
            const execCursorSpy = jest
                .spyOn((repository as any).orepo, 'execCursor')
                .mockResolvedValue([{ DRUMID: 1 }]);
            const res = await repository.createDrum(dto);
            expect(execCursorSpy).toHaveBeenCalledWith('WHN_CREATE_DRUM', dto, expect.any(Array));
            expect(res).toEqual([{ DRUMID: 1 }]);
        });

        it('should call oracle execCursor on updateDrum', async () => {
            const dto: UpdateDrumDto = {
                empNo: '15234',
                itemCode: 'F73175',
                prodNo: '2026091',
                drumId: 1,
                ctrlNo: 'C01',
                cut: 50,
                cutType: 2,
                reasonId: null,
            };
            const execCursorSpy = jest
                .spyOn((repository as any).orepo, 'execCursor')
                .mockResolvedValue([{ DRUMID: 1 }]);
            const res = await repository.updateDrum(dto);
            expect(execCursorSpy).toHaveBeenCalledWith('WHN_UPDATE_DRUM', dto, expect.any(Array));
            expect(res).toEqual([{ DRUMID: 1 }]);
        });

        it('should call oracle execProcedure on drumToStock', async () => {
            const dto: DrumToStockDto = {
                empNo: '15234',
                itemCode: 'F73175',
                prodNo: '2026091',
                drumId: 1,
            };
            const execProcedureSpy = jest
                .spyOn((repository as any).orepo, 'execProcedure')
                .mockResolvedValue({ status: true });
            const res = await repository.drumToStock(dto);
            expect(execProcedureSpy).toHaveBeenCalledWith(
                'WHN_DRUM_TO_STOCK',
                dto,
                expect.any(Array),
            );
            expect(res).toEqual({ status: true });
        });
    });
});
