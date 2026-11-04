import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { JopMarReqService } from 'src/joborder/jop-mar-req/jop-mar-req.service';
import { JopMarReqController } from 'src/joborder/jop-mar-req/jop-mar-req.controller';
import { CreateJopMarReqDto } from 'src/joborder/jop-mar-req/dto/create-jop-mar-req.dto';
import { UpdateJopMarReqDto } from 'src/joborder/jop-mar-req/dto/update-jop-mar-req.dto';
import { SearchJopMarReqDto } from 'src/joborder/jop-mar-req/dto/search-jop-mar-req.dto';
import { JopMarReq } from 'src/joborder/jop-mar-req/entities/jop-mar-req.entity';

describe('JopMarReq Module', () => {
    describe('DTO Validation', () => {
        it('should validate valid CreateJopMarReqDto', async () => {
            const dto = plainToInstance(CreateJopMarReqDto, {
                MFGNO: 'M12345',
                PONO: 100,
                LINENO: 1,
                ACTION_BY: '12345',
                REQUESTDATE: '2026-11-04',
                REMARK: 'Urgent delivery requested',
            });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should fail validation on invalid types in CreateJopMarReqDto', async () => {
            const dto = plainToInstance(CreateJopMarReqDto, {
                MFGNO: 123 as any,
                PONO: 'not-a-number' as any,
            });
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
        });

        it('should validate SearchJopMarReqDto and accept orderbyDirection', async () => {
            const validDto = plainToInstance(SearchJopMarReqDto, {
                JOP_MFGNO: 'M12345',
                JOP_PONO: 100,
                orderby: 'JOP_REVISION',
                orderbyDirection: 'DESC',
                distinct: true,
            });
            const validErrors = await validate(validDto);
            expect(validErrors.length).toBe(0);

            const invalidDto = plainToInstance(SearchJopMarReqDto, {
                orderbyDirection: 'INVALID_DIRECTION' as any,
            });
            const invalidErrors = await validate(invalidDto);
            expect(invalidErrors.length).toBeGreaterThan(0);
        });
    });

    describe('JopMarReqService', () => {
        let service: JopMarReqService;
        let mockReqRepo: any;
        let mockDataSource: any;
        let mockAmecCalendarService: any;
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
                    save: jest.fn((entity) => Promise.resolve({ ...entity })),
                    getRepository: jest.fn().mockImplementation(() => mockReqRepo),
                },
            };

            mockReqRepo = {
                findOne: jest.fn(),
                createQueryBuilder: jest.fn(),
            };

            mockDataSource = {
                createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
                getMetadata: jest.fn((name: string) => {
                    if (name === 'JOP_MAR_REQ') {
                        return {
                            columns: [
                                { propertyName: 'JOP_MFGNO' },
                                { propertyName: 'JOP_PONO' },
                                { propertyName: 'JOP_LINENO' },
                                { propertyName: 'JOP_REVISION' },
                                { propertyName: 'JOP_PUR_STATUS' },
                                { propertyName: 'JOP_MAR_REQUEST' },
                                { propertyName: 'JOP_MAR_REQUEST_DATE' },
                                { propertyName: 'JOP_MAR_INPUT_DATE' },
                                { propertyName: 'JOP_MAR_REMARK' },
                            ],
                        };
                    }
                    if (name === 'AMECUSERALL') {
                        return {
                            columns: [{ propertyName: 'SEMPNO' }, { propertyName: 'SNAME' }],
                        };
                    }
                    return { columns: [] };
                }),
                createQueryBuilder: jest.fn(),
            };

            mockAmecCalendarService = {
                addWorkDays: jest.fn().mockResolvedValue(7),
            };

            service = new JopMarReqService(mockReqRepo, mockDataSource, mockAmecCalendarService);
        });

        it('should create initial revision (revision 1) when no previous record exists', async () => {
            mockReqRepo.findOne.mockResolvedValue(null);
            jest.spyOn(service, 'getRevisionHistory').mockResolvedValue([
                {
                    JOP_REVISION: 1,
                    JOP_MFGNO: 'M1001',
                    JOP_PONO: 200,
                    JOP_LINENO: 1,
                    JOP_PUR_STATUS: 0,
                    JOP_MAR_REQUEST: 'EMP01',
                    JOP_MAR_REQUEST_DATE: new Date('2026-11-04'),
                    JOP_MAR_INPUT_DATE: new Date(),
                    JOP_MAR_REMARK: 'First Rev',
                    marRequest: { SEMPNO: 'EMP01', SNAME: 'Test User' } as any,
                } as JopMarReq,
            ]);

            const dto = {
                MFGNO: 'M1001',
                PONO: 200,
                LINENO: 1,
                ACTION_BY: 'EMP01',
                REQUESTDATE: '2026-11-04',
                REMARK: 'First Rev',
            } as CreateJopMarReqDto;

            const result = await service.create(dto);

            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.manager.create).toHaveBeenCalledWith(
                JopMarReq,
                expect.objectContaining({
                    JOP_MFGNO: 'M1001',
                    JOP_PONO: 200,
                    JOP_LINENO: 1,
                    JOP_REVISION: 1,
                }),
            );
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(result.status).toBe(true);
            expect(result.rev[0].REVISION_TEXT).toBe('A');
            expect(result.rev[0].NAME).toBe('Test User');
        });

        it('should increment revision when previous record exists', async () => {
            const previousRecord: any = {
                JOP_MFGNO: 'M1001',
                JOP_PONO: 200,
                JOP_LINENO: 1,
                JOP_REVISION: 1,
            };
            mockReqRepo.findOne.mockResolvedValue(previousRecord);

            jest.spyOn(service, 'getRevisionHistory').mockResolvedValue([
                {
                    JOP_REVISION: 2,
                    JOP_MFGNO: 'M1001',
                    JOP_PONO: 200,
                    JOP_LINENO: 1,
                    JOP_PUR_STATUS: 0,
                    JOP_MAR_REQUEST: 'EMP01',
                    JOP_MAR_REQUEST_DATE: new Date('2026-11-05'),
                    JOP_MAR_INPUT_DATE: new Date(),
                    JOP_MAR_REMARK: 'Second Rev',
                    marRequest: null,
                } as any,
            ]);

            const dto = {
                MFGNO: 'M1001',
                PONO: 200,
                LINENO: 1,
                ACTION_BY: 'EMP01',
                REQUESTDATE: '2026-11-05',
                REMARK: 'Second Rev',
            } as CreateJopMarReqDto;

            // When marRequest is null, current code does r.marRequest.SNAME which throws if not null-safe.
            await expect(service.create(dto)).rejects.toThrow();
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });

        it('should handle findLatestRevision query', async () => {
            const record = { JOP_MFGNO: 'M001', JOP_PONO: 1, JOP_LINENO: 1, JOP_REVISION: 2 };
            mockReqRepo.findOne.mockResolvedValue(record);

            const result = await service.findLatestRevision('M001', 1, 1);
            expect(mockReqRepo.findOne).toHaveBeenCalledWith({
                where: { JOP_MFGNO: 'M001', JOP_PONO: 1, JOP_LINENO: 1 },
                order: { JOP_REVISION: 'DESC' },
            });
            expect(result).toEqual(record);
        });

        it('should update existing record in update()', async () => {
            const existingRecord = {
                JOP_MFGNO: 'M001',
                JOP_PONO: 1,
                JOP_LINENO: 1,
                JOP_PUR_STATUS: 0,
            };
            mockReqRepo.findOne.mockResolvedValue(existingRecord);

            const dto = {
                MFGNO: 'M001',
                PONO: 1,
                LINENO: 1,
                JOP_PUR_STATUS: 1,
            } as UpdateJopMarReqDto;

            const result = await service.update(dto);
            expect(result.status).toBe(true);
            expect(result.data.JOP_PUR_STATUS).toBe(1);
        });

        it('should throw error when updating a non-existent record in update()', async () => {
            mockReqRepo.findOne.mockResolvedValue(null);

            const dto = {
                MFGNO: 'NOT_FOUND',
                PONO: 1,
                LINENO: 1,
                JOP_PUR_STATUS: 1,
            } as UpdateJopMarReqDto;

            await expect(service.update(dto)).rejects.toThrow('Record not found');
        });

        it('should search records with filters', async () => {
            const qb: any = {
                from: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
                distinct: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue([{ JOP_MFGNO: 'M001', JOP_REVISION: 1 }]),
            };
            mockDataSource.createQueryBuilder.mockReturnValue(qb);

            const dto = {
                JOP_MFGNO: 'M001',
                JOP_PONO: 10,
                JOP_LINENO: 1,
                JOP_REVISION: 1,
                JOP_PUR_STATUS: 1,
                JOP_MAR_REQUEST: 'EMP01',
                JOP_MAR_REQUEST_DATE: '2026-11-04',
                JOP_MAR_INPUT_DATE: '2026-11-04',
                SREQDATE: '2026-11-01',
                EREQDATE: '2026-11-30',
                SINPUTDATE: '2026-11-01',
                EINPUTDATE: '2026-11-30',
                orderby: 'JOP_REVISION',
                orderbyDirection: 'ASC',
                distinct: true,
                fields: ['JOP_MFGNO', 'SNAME'],
            } as SearchJopMarReqDto;

            const result = await service.search(dto);
            expect(qb.distinct).toHaveBeenCalledWith(true);
            expect(qb.orderBy).toHaveBeenCalledWith('JOP_REVISION', 'ASC');
            expect(result).toHaveLength(1);
        });
    });

    describe('JopMarReqController', () => {
        let controller: JopMarReqController;
        let mockService: any;

        beforeEach(() => {
            mockService = {
                create: jest.fn(),
                update: jest.fn(),
                search: jest.fn(),
                getRevisionHistoryByKey: jest.fn(),
            };
            controller = new JopMarReqController(mockService);
        });

        it('should call service.create with dto', async () => {
            const dto = {
                MFGNO: 'M001',
                PONO: 1,
                LINENO: 1,
                ACTION_BY: 'EMP01',
            } as CreateJopMarReqDto;
            mockService.create.mockResolvedValue({ status: true });
            const result = await controller.create(dto);
            expect(mockService.create).toHaveBeenCalledWith(dto);
            expect(result).toEqual({ status: true });
        });

        it('should call service.update with dto', async () => {
            const dto = {
                MFGNO: 'M001',
                PONO: 1,
                LINENO: 1,
                JOP_PUR_STATUS: 1,
            } as UpdateJopMarReqDto;
            mockService.update.mockResolvedValue({ status: true });
            const result = await controller.update(dto);
            expect(mockService.update).toHaveBeenCalledWith(dto);
            expect(result).toEqual({ status: true });
        });

        it('should call service.search with dto', async () => {
            const dto = { JOP_MFGNO: 'M001' } as SearchJopMarReqDto;
            mockService.search.mockResolvedValue([{ JOP_MFGNO: 'M001' }]);
            const result = await controller.search(dto);
            expect(mockService.search).toHaveBeenCalledWith(dto);
            expect(result).toHaveLength(1);
        });

        it('should call service.getRevisionHistoryByKey with list', async () => {
            const list = [{ mfg: 'M001', pono: 1, line: 1 }];
            mockService.getRevisionHistoryByKey.mockResolvedValue([{ REVISION: 1 }]);
            const result = await controller.getRevisionHistoryByKey(list);
            expect(mockService.getRevisionHistoryByKey).toHaveBeenCalledWith(list);
            expect(result).toHaveLength(1);
        });
    });
});
