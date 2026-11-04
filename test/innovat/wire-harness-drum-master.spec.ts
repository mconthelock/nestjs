import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { DrumMasterDto } from 'src/innovat/wire-harness-drum-master/dto/drum-master.dto';
import { WireHarnessDrumMasterService } from 'src/innovat/wire-harness-drum-master/wire-harness-drum-master.service';
import { WireHarnessDrumMasterController } from 'src/innovat/wire-harness-drum-master/wire-harness-drum-master.controller';
import { WireHarnessDrumMasterRepository } from 'src/innovat/wire-harness-drum-master/wire-harness-drum-master.repository';

describe('WireHarnessDrumMaster Module', () => {
    describe('DrumMasterDto Validation', () => {
        it('should pass validation with valid data', async () => {
            const dto = plainToInstance(DrumMasterDto, {
                itemCode: 'F73175',
                groupId: 1,
                cableCode: 'EVV25C',
                length: 900,
                lslSpec: 50,
                empNo: '15234',
            });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should fail validation with invalid numbers or missing strings', async () => {
            const dto = plainToInstance(DrumMasterDto, {
                itemCode: '',
                groupId: 'not-a-number' as any,
                cableCode: '',
                length: 'invalid' as any,
                lslSpec: 50,
                empNo: '',
            });
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    describe('WireHarnessDrumMasterService', () => {
        let service: WireHarnessDrumMasterService;
        let mockRepo: any;

        beforeEach(() => {
            mockRepo = {
                list: jest.fn(),
                save: jest.fn(),
            };
            service = new WireHarnessDrumMasterService(mockRepo);
        });

        it('should get list with filter condition', async () => {
            const condition: FiltersDto = {
                filters: [{ field: 'MT_ITEMCODE', op: 'eq', value: 'F73175' }],
            };
            mockRepo.list.mockResolvedValue([{ MT_ITEMCODE: 'F73175' }]);

            const result = await service.list(condition);
            expect(mockRepo.list).toHaveBeenCalledWith(condition);
            expect(result).toEqual([{ MT_ITEMCODE: 'F73175' }]);
        });

        it('should save drum master records', async () => {
            const dtos: DrumMasterDto[] = [
                {
                    itemCode: 'F73175',
                    groupId: 1,
                    cableCode: 'EVV25C',
                    length: 900,
                    lslSpec: 50,
                    empNo: '15234',
                },
            ];
            mockRepo.save.mockResolvedValue(dtos);

            const result = await service.save(dtos);
            expect(mockRepo.save).toHaveBeenCalledWith(dtos);
            expect(result).toEqual(dtos);
        });
    });

    describe('WireHarnessDrumMasterController', () => {
        let controller: WireHarnessDrumMasterController;
        let mockService: any;

        beforeEach(() => {
            mockService = {
                list: jest.fn(),
                save: jest.fn(),
            };
            controller = new WireHarnessDrumMasterController(mockService);
        });

        it('should call service.list and return drum master list', async () => {
            const condition: FiltersDto = {};
            mockService.list.mockResolvedValue([]);

            const result = await controller.list(condition);
            expect(mockService.list).toHaveBeenCalledWith(condition);
            expect(result).toEqual([]);
        });

        it('should call service.save and return saved drum master', async () => {
            const dtos: DrumMasterDto[] = [
                {
                    itemCode: 'F73175',
                    groupId: 1,
                    cableCode: 'EVV25C',
                    length: 900,
                    lslSpec: 50,
                    empNo: '15234',
                },
            ];
            mockService.save.mockResolvedValue(dtos);

            const result = await controller.save(dtos);
            expect(mockService.save).toHaveBeenCalledWith(dtos);
            expect(result).toEqual(dtos);
        });
    });

    describe('WireHarnessDrumMasterRepository', () => {
        let repository: WireHarnessDrumMasterRepository;
        let mockDataSource: any;
        let mockTargetRepo: any;
        let mockDeleteQb: any;
        let mockSelectQb: any;

        beforeEach(() => {
            mockDeleteQb = {
                delete: jest.fn().mockReturnThis(),
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({ affected: 1 }),
            };

            mockSelectQb = {
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue([]),
            };

            mockTargetRepo = {
                createQueryBuilder: jest.fn((alias?: string) => {
                    if (alias) return mockSelectQb;
                    return mockDeleteQb;
                }),
                save: jest.fn((data) => Promise.resolve(data)),
            };

            mockDataSource = {
                manager: {
                    getRepository: jest.fn().mockReturnValue(mockTargetRepo),
                },
            };

            repository = new WireHarnessDrumMasterRepository(mockDataSource);
        });

        it('should get drum master list ordered by MT_ITEMCODE', async () => {
            mockSelectQb.getMany.mockResolvedValue([{ MT_ITEMCODE: 'F73175' }]);
            const res = await repository.list({});
            expect(mockSelectQb.orderBy).toHaveBeenCalledWith('A.MT_ITEMCODE', 'ASC');
            expect(res).toEqual([{ MT_ITEMCODE: 'F73175' }]);
        });

        it('should delete unselected records and save new records on save()', async () => {
            const dtos: DrumMasterDto[] = [
                {
                    itemCode: 'F73175',
                    groupId: 1,
                    cableCode: 'EVV25C',
                    length: 900,
                    lslSpec: 50,
                    empNo: '15234',
                },
            ];

            const result = await repository.save(dtos);

            expect(mockDeleteQb.where).toHaveBeenCalledWith('GRP_ID = :groupId', { groupId: 1 });
            expect(mockDeleteQb.andWhere).toHaveBeenCalledWith(
                'MT_ITEMCODE NOT IN (:...itemCodes)',
                {
                    itemCodes: ['F73175'],
                },
            );
            expect(mockDeleteQb.execute).toHaveBeenCalled();
            expect(mockTargetRepo.save).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        MT_ITEMCODE: 'F73175',
                        GRP_ID: 1,
                        MT_CABLECODE: 'EVV25C',
                        MT_LENGTH: 900,
                        MT_LSLSPEC: 50,
                        MT_USERUPDATE: '15234',
                    }),
                ]),
            );
            expect(result).toHaveLength(1);
        });
    });
});
