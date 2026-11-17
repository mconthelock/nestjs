import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { JopPurConfService } from 'src/joborder/jop-pur-conf/jop-pur-conf.service';
import { JopPurConfController } from 'src/joborder/jop-pur-conf/jop-pur-conf.controller';
import { CreateJopPurConfDto } from 'src/joborder/jop-pur-conf/dto/create-jop-pur-conf.dto';
import { UpdateJopPurConfDto } from 'src/joborder/jop-pur-conf/dto/update-jop-pur-conf.dto';
import { SearchJopPurConfDto } from 'src/joborder/jop-pur-conf/dto/search-jop-pur-conf.dto';
import { JopPurConf } from 'src/joborder/jop-pur-conf/entities/jop-pur-conf.entity';

describe('JopPurConf Module', () => {
    describe('DTO Validation', () => {
        it('should validate valid CreateJopPurConfDto', async () => {
            const dto = plainToInstance(CreateJopPurConfDto, {
                MFGNO: 'M2001',
                PONO: 300,
                LINENO: 2,
                ACTION_BY: 'EMP02',
                CONFIRMDATE: '2026-11-04',
                REMARK: 'Confirmed with vendor',
            });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should validate SearchJopPurConfDto', async () => {
            const dto = plainToInstance(SearchJopPurConfDto, {
                JOP_MFGNO: 'M2001',
                JOP_PONO: 300,
                JOP_PUR_CONFIRM: 'EMP02',
                SCONFDATE: '2026-11-01',
                ECONFDATE: '2026-11-30',
                orderby: 'JOP_REVISION',
                orderbyDirection: 'DESC',
            });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });
    });

    describe('JopPurConfService', () => {
        let service: JopPurConfService;
        let mockConfRepo: any;
        let mockDataSource: any;
        let mockAmecCalendarService: any;
        let mockJopMarReqService: any;
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
                    getRepository: jest.fn().mockImplementation(() => mockConfRepo),
                },
            };

            mockConfRepo = {
                findOne: jest.fn(),
                createQueryBuilder: jest.fn(),
            };

            mockDataSource = {
                createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
                getRepository: jest.fn().mockReturnValue(mockConfRepo),
                getMetadata: jest.fn((name: string) => {
                    if (name === 'JOP_PUR_CONF') {
                        return {
                            columns: [
                                { propertyName: 'JOP_MFGNO' },
                                { propertyName: 'JOP_PONO' },
                                { propertyName: 'JOP_LINENO' },
                                { propertyName: 'JOP_REVISION' },
                                { propertyName: 'JOP_PUR_CONFIRM' },
                                { propertyName: 'JOP_PUR_CONFIRM_DATE' },
                                { propertyName: 'JOP_PUR_INPUT_DATE' },
                                { propertyName: 'JOP_PUR_REMARK' },
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

            mockJopMarReqService = {
                update: jest.fn().mockResolvedValue({ status: true }),
            };

            service = new JopPurConfService(
                mockConfRepo,
                mockDataSource,
                mockAmecCalendarService,
                mockJopMarReqService,
            );
        });

        it('should create initial confirmation and update purStatus on JopMarReq', async () => {
            mockConfRepo.findOne.mockResolvedValue(null);
            jest.spyOn(service, 'getRevisionHistory').mockResolvedValue([
                {
                    JOP_REVISION: 1,
                    JOP_MFGNO: 'M2001',
                    JOP_PONO: 300,
                    JOP_LINENO: 2,
                    JOP_PUR_CONFIRM: 'EMP02',
                    JOP_PUR_CONFIRM_DATE: new Date('2026-11-04'),
                    JOP_PUR_INPUT_DATE: new Date(),
                    JOP_PUR_REMARK: 'Approved',
                    purConfirm: { SEMPNO: 'EMP02', SNAME: 'Pur Officer' } as any,
                } as JopPurConf,
            ]);

            const dto = {
                MFGNO: 'M2001',
                PONO: 300,
                LINENO: 2,
                ACTION_BY: 'EMP02',
                CONFIRMDATE: '2026-11-04',
                REMARK: 'Approved',
            } as CreateJopPurConfDto;

            const result = await service.create(dto);

            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.manager.create).toHaveBeenCalledWith(
                JopPurConf,
                expect.objectContaining({
                    JOP_MFGNO: 'M2001',
                    JOP_PONO: 300,
                    JOP_LINENO: 2,
                    JOP_REVISION: 1,
                }),
            );
            expect(mockJopMarReqService.update).toHaveBeenCalledWith(
                {
                    MFGNO: 'M2001',
                    PONO: 300,
                    LINENO: 2,
                    JOP_PUR_STATUS: 1,
                },
                mockQueryRunner,
            );
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(result.status).toBe(true);
            expect(result.rev[0].NAME).toBe('Pur Officer');
        });

        it('should rollback transaction if updating marketing request status fails', async () => {
            mockConfRepo.findOne.mockResolvedValue(null);
            jest.spyOn(service, 'getRevisionHistory').mockResolvedValue([]);
            mockJopMarReqService.update.mockRejectedValue(new Error('Record not found'));

            const dto = {
                MFGNO: 'NON_EXISTENT',
                PONO: 300,
                LINENO: 2,
                ACTION_BY: 'EMP02',
                CONFIRMDATE: '2026-11-04',
                REMARK: 'Approved',
            } as CreateJopPurConfDto;

            await expect(service.create(dto)).rejects.toThrow('Record not found');
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });

        it('should search purchase confirmations with criteria', async () => {
            const qb: any = {
                from: jest.fn().mockReturnThis(),
                innerJoin: jest.fn().mockReturnThis(),
                distinct: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue([{ JOP_MFGNO: 'M2001', JOP_REVISION: 1 }]),
            };
            mockDataSource.createQueryBuilder.mockReturnValue(qb);

            const dto = {
                JOP_MFGNO: 'M2001',
                JOP_PONO: 300,
                JOP_LINENO: 2,
                JOP_REVISION: 1,
                JOP_PUR_CONFIRM: 'EMP02',
                JOP_PUR_CONFIRM_DATE: '2026-11-04',
                JOP_PUR_INPUT_DATE: '2026-11-04',
                SCONFDATE: '2026-11-01',
                ECONFDATE: '2026-11-30',
                SINPUTDATE: '2026-11-01',
                EINPUTDATE: '2026-11-30',
                distinct: true,
            } as SearchJopPurConfDto;

            const result = await service.search(dto);
            expect(qb.distinct).toHaveBeenCalledWith(true);
            expect(result).toHaveLength(1);
        });
    });

    describe('JopPurConfController', () => {
        let controller: JopPurConfController;
        let mockService: any;

        beforeEach(() => {
            mockService = {
                create: jest.fn(),
                search: jest.fn(),
                getRevisionHistoryByKey: jest.fn(),
            };
            controller = new JopPurConfController(mockService);
        });

        it('should call service.create with dto', async () => {
            const dto = {
                MFGNO: 'M2001',
                PONO: 300,
                LINENO: 2,
                ACTION_BY: 'EMP02',
                CONFIRMDATE: '2026-11-04',
            } as CreateJopPurConfDto;
            mockService.create.mockResolvedValue({ status: true });
            const result = await controller.create(dto);
            expect(mockService.create).toHaveBeenCalledWith(dto);
            expect(result).toEqual({ status: true });
        });

        it('should call service.search with dto', async () => {
            const dto = { JOP_MFGNO: 'M2001' } as SearchJopPurConfDto;
            mockService.search.mockResolvedValue([{ JOP_MFGNO: 'M2001' }]);
            const result = await controller.search(dto);
            expect(mockService.search).toHaveBeenCalledWith(dto);
            expect(result).toHaveLength(1);
        });

        it('should call service.getRevisionHistoryByKey with list', async () => {
            const list = [{ mfg: 'M2001', pono: 300, line: 2 }];
            mockService.getRevisionHistoryByKey.mockResolvedValue([{ REVISION: 1 }]);
            const result = await controller.getRevisionHistoryByKey(list);
            expect(mockService.getRevisionHistoryByKey).toHaveBeenCalledWith(list);
            expect(result).toHaveLength(1);
        });
    });
});
