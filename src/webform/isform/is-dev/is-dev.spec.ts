import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Request } from 'express';
import { IsDevController } from './is-dev.controller';
import { IsDevService } from './is-dev.service';
import { IsDevFormRepository } from './is-dev.repositoty';
import { CreateIsDevDto } from './dto/create-is-dev.dto';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { HandleFileFormService } from 'src/webform/handle-file-form/handle-file-form.service';
import { ISDEV_DEVELOPER } from 'src/common/Entities/webform/table/ISDEV_DEVELOPER.entity';
import { ISDEV_REQUEST } from 'src/common/Entities/webform/table/ISDEV_REQUEST.entity';
import { ISDEV_BENEFIT } from 'src/common/Entities/webform/table/ISDEV_BENEFIT.entity';
import { ISDEV_MANHOURS } from 'src/common/Entities/webform/table/ISDEV_MANHOURS.entity';
import { ISDEV_INVESTMENT } from 'src/common/Entities/webform/table/ISDEV_INVESTMENT.entity';
import * as ipUtils from 'src/common/utils/ip.utils';

describe('POST /form/is/is-dev/create', () => {
    const mockFormKey = {
        NFRMNO: 10,
        VORGNO: '050601',
        CYEAR: '26',
        CYEAR2: '2026',
        NRUNNO: 1,
    };

    const buildCreateDto = (
        overrides: Partial<CreateIsDevDto> = {},
    ): CreateIsDevDto => ({
        NFRMNO: 10,
        VORGNO: '050601',
        CYEAR: '26',
        REQBY: '14077',
        INPUTBY: '14077',
        REMARK: 'Test remark',
        OBJECTIVE: 1,
        OBJECTIVE_OTHER: '',
        CATEGORY: 1,
        JOBTYPE: 1,
        STATUS: 1,
        PLANYEAR: 2026,
        SYSTEMNAME: 'IS-DEV System',
        TITLE: 'Automate IS-DEV Workflow',
        REQ_ORG: '050601',
        REQ_PIC: '14077',
        REQ_DATE: new Date('2026-10-26'),
        SPEC_CONFIRM_PLAN: new Date('2026-11-01'),
        PURPOSE: 'Reduce manual processing time',
        CURRENT_WORKFLOW: 'Manual Excel tracking',
        EXPECTED_WORKFLOW: 'Automated web form workflow',
        SYSTEM_TYPE: 'WEB',
        ...overrides,
    });

    describe('IsDevController.create', () => {
        let controller: IsDevController;
        let service: jest.Mocked<Pick<IsDevService, 'create'>>;

        beforeEach(() => {
            service = {
                create: jest.fn(),
            };
            controller = new IsDevController(service as unknown as IsDevService);
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should extract client IP and call IsDevService.create with ip, dto, and files', async () => {
            jest.spyOn(ipUtils, 'getClientIP').mockReturnValue('172.21.10.55');
            service.create.mockResolvedValue(undefined);

            const req = {
                headers: { 'x-forwarded-for': '172.21.10.55' },
            } as unknown as Request;
            const dto = buildCreateDto();
            const files = [
                {
                    originalname: 'spec.pdf',
                    filename: 'spec.pdf',
                } as Express.Multer.File,
            ];

            await controller.create(req, dto, files);

            expect(ipUtils.getClientIP).toHaveBeenCalledWith(req);
            expect(service.create).toHaveBeenCalledWith(
                '172.21.10.55',
                dto,
                files,
            );
        });

        it('should pass undefined files when no files are uploaded', async () => {
            jest.spyOn(ipUtils, 'getClientIP').mockReturnValue('127.0.0.1');
            service.create.mockResolvedValue(undefined);

            const req = {} as unknown as Request;
            const dto = buildCreateDto();

            await controller.create(req, dto, undefined);

            expect(service.create).toHaveBeenCalledWith(
                '127.0.0.1',
                dto,
                undefined,
            );
        });
    });

    describe('IsDevService.create', () => {
        let service: IsDevService;
        let formCreateService: { create: jest.Mock };
        let repo: {
            create: jest.Mock;
            createBenefit: jest.Mock;
            createManhours: jest.Mock;
            createInvest: jest.Mock;
        };
        let fileService: { insertFiles: jest.Mock };

        beforeEach(async () => {
            formCreateService = {
                create: jest.fn().mockResolvedValue({
                    status: true,
                    data: mockFormKey,
                    message: { message: 'Success' },
                }),
            };

            repo = {
                create: jest.fn().mockResolvedValue({}),
                createBenefit: jest.fn().mockResolvedValue({}),
                createManhours: jest.fn().mockResolvedValue({}),
                createInvest: jest.fn().mockResolvedValue({}),
            };

            fileService = {
                insertFiles: jest.fn().mockResolvedValue({}),
            };

            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    IsDevService,
                    {
                        provide: getRepositoryToken(
                            ISDEV_DEVELOPER,
                            'webformConnection',
                        ),
                        useValue: {},
                    },
                    {
                        provide: getRepositoryToken(
                            ISDEV_REQUEST,
                            'webformConnection',
                        ),
                        useValue: {},
                    },
                    {
                        provide: FormCreateService,
                        useValue: formCreateService,
                    },
                    {
                        provide: IsDevFormRepository,
                        useValue: repo,
                    },
                    {
                        provide: HandleFileFormService,
                        useValue: fileService,
                    },
                ],
            }).compile();

            service = module.get<IsDevService>(IsDevService);
            jest.spyOn(console, 'log').mockImplementation(() => {});
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should create form, request, files, benefits, manhours, and investments when all data is provided', async () => {
            const dto = buildCreateDto({
                DRAFT: '0',
                benefit: [
                    {
                        BENEFIT: 1,
                        BENEFIT_CURRENT: 10000,
                        BENEFIT_AFTER: 2000,
                    },
                ],
                manhours: [
                    {
                        POSITION: 'Engineer',
                        COST: 500,
                        HOURS_PRESENT: 40,
                        HOURS_AFTER: 10,
                    },
                ],
                invest: [
                    {
                        DEVICE: 1,
                        PRICE: 15000,
                        QTY: 2,
                    },
                ],
            });
            const files = [
                { originalname: 'doc1.pdf' } as Express.Multer.File,
                { originalname: 'doc2.png' } as Express.Multer.File,
            ];

            await service.create('172.21.10.55', dto, files);

            expect(formCreateService.create).toHaveBeenCalledWith(
                {
                    NFRMNO: dto.NFRMNO,
                    VORGNO: dto.VORGNO,
                    CYEAR: dto.CYEAR,
                    REQBY: dto.REQBY,
                    INPUTBY: dto.INPUTBY,
                    REMARK: dto.REMARK,
                    DRAFT: '0',
                },
                '172.21.10.55',
            );

            expect(repo.create).toHaveBeenCalledWith({
                ...dto,
                ...mockFormKey,
            });

            expect(fileService.insertFiles).toHaveBeenCalledTimes(2);
            expect(fileService.insertFiles).toHaveBeenNthCalledWith(
                1,
                {
                    ...mockFormKey,
                    FORM_TYPE: 'IS',
                    FILE_CODE: 'FILE',
                    CREATEBY: dto.INPUTBY,
                },
                files[0],
            );
            expect(fileService.insertFiles).toHaveBeenNthCalledWith(
                2,
                {
                    ...mockFormKey,
                    FORM_TYPE: 'IS',
                    FILE_CODE: 'FILE',
                    CREATEBY: dto.INPUTBY,
                },
                files[1],
            );

            expect(repo.createBenefit).toHaveBeenCalledTimes(1);
            expect(repo.createBenefit).toHaveBeenCalledWith({
                ...mockFormKey,
                ...dto.benefit[0],
            });

            expect(repo.createManhours).toHaveBeenCalledTimes(1);
            expect(repo.createManhours).toHaveBeenCalledWith({
                ...mockFormKey,
                ...dto.manhours[0],
            });

            expect(repo.createInvest).toHaveBeenCalledTimes(1);
            expect(repo.createInvest).toHaveBeenCalledWith({
                ...mockFormKey,
                ...dto.invest[0],
            });
        });

        it('should omit DRAFT from FormCreateService.create when DRAFT is undefined and skip optional arrays/files', async () => {
            const dto = buildCreateDto();

            await service.create('127.0.0.1', dto);

            expect(formCreateService.create).toHaveBeenCalledWith(
                {
                    NFRMNO: dto.NFRMNO,
                    VORGNO: dto.VORGNO,
                    CYEAR: dto.CYEAR,
                    REQBY: dto.REQBY,
                    INPUTBY: dto.INPUTBY,
                    REMARK: dto.REMARK,
                },
                '127.0.0.1',
            );
            expect(
                formCreateService.create.mock.calls[0][0],
            ).not.toHaveProperty('DRAFT');

            expect(repo.create).toHaveBeenCalledTimes(1);
            expect(fileService.insertFiles).not.toHaveBeenCalled();
            expect(repo.createBenefit).not.toHaveBeenCalled();
            expect(repo.createManhours).not.toHaveBeenCalled();
            expect(repo.createInvest).not.toHaveBeenCalled();
        });

        it('should throw wrapped error when FormCreateService.create returns status false', async () => {
            formCreateService.create.mockResolvedValue({
                status: false,
                message: { message: 'Flow master not found' },
            });

            const dto = buildCreateDto();

            await expect(service.create('127.0.0.1', dto)).rejects.toThrow(
                'Request IS-DEV Form Error: Flow master not found',
            );
            expect(repo.create).not.toHaveBeenCalled();
        });

        it('should throw wrapped error when repository create fails', async () => {
            repo.create.mockRejectedValue(new Error('Database insert failed'));

            const dto = buildCreateDto();

            await expect(service.create('127.0.0.1', dto)).rejects.toThrow(
                'Request IS-DEV Form Error: Database insert failed',
            );
        });
    });

    describe('IsDevFormRepository create methods', () => {
        let repo: IsDevFormRepository;
        let saveMocks: Map<any, jest.Mock>;

        beforeEach(() => {
            saveMocks = new Map<any, jest.Mock>([
                [ISDEV_REQUEST, jest.fn().mockImplementation((d) => d)],
                [ISDEV_BENEFIT, jest.fn().mockImplementation((d) => d)],
                [ISDEV_MANHOURS, jest.fn().mockImplementation((d) => d)],
                [ISDEV_INVESTMENT, jest.fn().mockImplementation((d) => d)],
            ]);

            const mockDs: any = {
                manager: {
                    getRepository: jest.fn((entity) => ({
                        save: saveMocks.get(entity),
                    })),
                },
            };

            repo = new IsDevFormRepository(mockDs);
        });

        it('should save request, benefit, manhours, and investment to their respective entities', async () => {
            const reqPayload = { ...buildCreateDto(), ...mockFormKey };
            const benefitPayload = {
                ...mockFormKey,
                BENEFIT: 1,
                BENEFIT_CURRENT: 100,
                BENEFIT_AFTER: 50,
            };
            const manhoursPayload = {
                ...mockFormKey,
                POSITION: 'Dev',
                COST: 300,
                HOURS_PRESENT: 10,
                HOURS_AFTER: 2,
            };
            const investPayload = {
                ...mockFormKey,
                DEVICE: 2,
                PRICE: 5000,
                QTY: 1,
            };

            await repo.create(reqPayload);
            await repo.createBenefit(benefitPayload);
            await repo.createManhours(manhoursPayload);
            await repo.createInvest(investPayload);

            expect(saveMocks.get(ISDEV_REQUEST)).toHaveBeenCalledWith(
                reqPayload,
            );
            expect(saveMocks.get(ISDEV_BENEFIT)).toHaveBeenCalledWith(
                benefitPayload,
            );
            expect(saveMocks.get(ISDEV_MANHOURS)).toHaveBeenCalledWith(
                manhoursPayload,
            );
            expect(saveMocks.get(ISDEV_INVESTMENT)).toHaveBeenCalledWith(
                investPayload,
            );
        });
    });
});
