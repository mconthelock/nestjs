import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SetRequestDateService } from 'src/joborder/set-request-date/set-request-date.service';
import { SetRequestDateController } from 'src/joborder/set-request-date/set-request-date.controller';
import { UpsertSetRequestDateDto } from 'src/joborder/set-request-date/dto/create-set-request-date.dto';
import { UpdateSetRequestDateDto } from 'src/joborder/set-request-date/dto/update-set-request-date.dto';
import { SetRequestDate } from 'src/joborder/set-request-date/entities/set-request-date.entity';

describe('SetRequestDate Module (Legacy JOP_REQ)', () => {
    describe('DTO Validation', () => {
        it('should validate valid UpsertSetRequestDateDto', async () => {
            const dto = plainToInstance(UpsertSetRequestDateDto, {
                MFGNO: 'M12345',
                PONO: 100,
                LINENO: 1,
                ACTION_BY: 'EMP01',
                REQUESTDATE: '2026-11-04',
                REMARK: 'Legacy request note',
            });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate UpdateSetRequestDateDto', async () => {
            const dto = plainToInstance(UpdateSetRequestDateDto, {
                MFGNO: 'M12345',
                PONO: 100,
                LINENO: 1,
                REVISION: 1,
                ACTION_BY: 'EMP02',
                CONFIRMDATE: '2026-11-04',
                PUR_REMARK: 'Legacy confirm note',
            });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });
    });

    describe('SetRequestDateService', () => {
        let service: SetRequestDateService;
        let mockRepo: any;
        let mockDataSource: any;
        let mockQueryRunner: any;

        beforeEach(() => {
            mockQueryRunner = {
                connect: jest.fn().mockResolvedValue(undefined),
                startTransaction: jest.fn().mockResolvedValue(undefined),
                commitTransaction: jest.fn().mockResolvedValue(undefined),
                rollbackTransaction: jest.fn().mockResolvedValue(undefined),
                release: jest.fn().mockResolvedValue(undefined),
                manager: {
                    create: jest.fn((entity, data) => ({ ...data })),
                    save: jest.fn((entity, data) => {
                        if (Array.isArray(data)) return Promise.resolve(data);
                        return Promise.resolve(entity);
                    }),
                },
            };

            mockRepo = {
                create: jest.fn((data) => ({ ...data })),
                createQueryBuilder: jest.fn(),
            };

            mockDataSource = {
                createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
                getRepository: jest.fn().mockReturnValue({
                    findOne: jest.fn(),
                    createQueryBuilder: jest.fn(),
                }),
            };

            service = new SetRequestDateService(mockRepo, mockDataSource);
        });

        it('should create initial record when no latest revision exists', async () => {
            jest.spyOn(service, 'findLatestRevision').mockResolvedValue(null);
            jest.spyOn(service, 'getRevisionHistory').mockResolvedValue([]);

            const dto = {
                MFGNO: 'M001',
                PONO: 10,
                LINENO: 1,
                ACTION_BY: 'EMP01',
                REQUESTDATE: '2026-11-04',
                REMARK: 'Note',
            } as UpsertSetRequestDateDto;

            const result = await service.setRequestDate(dto);

            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.manager.create).toHaveBeenCalledWith(
                SetRequestDate,
                expect.objectContaining({
                    JOP_MFGNO: 'M001',
                    JOP_PONO: 10,
                    JOP_LINENO: 1,
                    JOP_REVISION: 1,
                }),
            );
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(result.status).toBe(200);
        });

        it('should increment revision when latest revision exists', async () => {
            const latest = {
                JOP_MFGNO: 'M001',
                JOP_PONO: 10,
                JOP_LINENO: 1,
                JOP_REVISION: 1,
            } as any;
            jest.spyOn(service, 'findLatestRevision').mockResolvedValue(latest);
            jest.spyOn(service, 'getRevisionHistory').mockResolvedValue([
                {
                    JOP_REVISION: 1,
                } as SetRequestDate,
            ]);

            const dto = {
                MFGNO: 'M001',
                PONO: 10,
                LINENO: 1,
                ACTION_BY: 'EMP01',
            } as UpsertSetRequestDateDto;

            const result = await service.setRequestDate(dto);

            expect(latest.JOP_REVISION).toBe(2);
            expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(latest);
            expect(result.status).toBe(200);
            expect(result.revision![0].JOP_REVISION_TEXT).toBe('A');
        });

        it('should update and confirm in UpdateJop', async () => {
            const qb: any = {
                select: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue([
                    {
                        JOP_REVISION: 1,
                        JOP_MFGNO: 'M001',
                        JOP_PONO: 10,
                        JOP_LINENO: 1,
                    },
                ]),
            };
            mockRepo.createQueryBuilder.mockReturnValue(qb);

            const dto = {
                PONO: 10,
                LINENO: 1,
                ACTION_BY: 'EMP02',
                CONFIRMDATE: '2026-11-04',
                PUR_REMARK: 'Confirmed',
            } as UpdateSetRequestDateDto;

            const result = await service.UpdateJop(dto);

            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockRepo.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    JOP_MFGNO: 'M001',
                    JOP_PONO: 10,
                    JOP_LINENO: 1,
                    JOP_PUR_STATUS: 1,
                    JOP_PUR_CONFIRM: 'EMP02',
                }),
            );
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(result.status).toBe(200);
            expect(result.record).toHaveLength(1);
        });

        it('should rollback transaction on error in UpdateJop', async () => {
            const qb: any = {
                select: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockRejectedValue(new Error('DB Error')),
            };
            mockRepo.createQueryBuilder.mockReturnValue(qb);

            const dto = {
                PONO: 10,
                LINENO: 1,
            } as UpdateSetRequestDateDto;

            await expect(service.UpdateJop(dto)).rejects.toThrow('DB Error');
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });
    });

    describe('SetRequestDateController', () => {
        let controller: SetRequestDateController;
        let mockService: any;
        let mockAmecCalendarService: any;

        beforeEach(() => {
            mockService = {
                setRequestDate: jest.fn(),
                UpdateJop: jest.fn(),
            };
            mockAmecCalendarService = {
                addWorkDays: jest.fn().mockResolvedValue(7),
            };
            controller = new SetRequestDateController(mockService, mockAmecCalendarService);
        });

        it('should call setRequestDate and add DeadLinePUR', async () => {
            const dto = {
                MFGNO: 'M001',
                PONO: 10,
                LINENO: 1,
                ACTION_BY: 'EMP01',
            } as UpsertSetRequestDateDto;
            mockService.setRequestDate.mockResolvedValue({
                record: {
                    JOP_MAR_INPUT_DATE: new Date('2026-11-04'),
                },
                revision: [],
                status: 200,
            });

            const result = await controller.upsert(dto);

            expect(mockService.setRequestDate).toHaveBeenCalledWith(dto);
            expect(mockAmecCalendarService.addWorkDays).toHaveBeenCalled();
            expect(result.message).toBe('Data saved successfully');
            expect(result.status).toBe(200);
            expect(result.data.DeadLinePUR).toBe(7);
        });

        it('should call UpdateJop', async () => {
            const dto = {
                PONO: 10,
                LINENO: 1,
            } as UpdateSetRequestDateDto;
            mockService.UpdateJop.mockResolvedValue({
                record: [{ JOP_MFGNO: 'M001' }],
                status: 200,
            });

            const result = await controller.UpdateJop(dto);

            expect(mockService.UpdateJop).toHaveBeenCalledWith(dto);
            expect(result.message).toBe('Data confirmed successfully');
            expect(result.status).toBe(200);
        });
    });
});
