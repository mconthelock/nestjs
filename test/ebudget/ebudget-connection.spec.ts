import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';

// All 8 Repositories in ebudget
import { SnRepository } from 'src/ebudget/sn/sn.repository';
import { BiddingRepository } from 'src/ebudget/bidding/bidding.repository';
import { EbgreqattfileRepository } from 'src/ebudget/ebgreqattfile/ebgreqattfile.repository';
import { EbgreqcaseRepository } from 'src/ebudget/ebgreqcase/ebgreqcase.repository';
import { EbgreqcolImageRepository } from 'src/ebudget/ebgreqcol-image/ebgreqcol-image.repository';
import { EbgreqformRepository } from 'src/ebudget/ebgreqform/ebgreqform.repository';
import { EbudgetQuotationRepository } from 'src/ebudget/ebudget-quotation/ebudget-quotation.repository';
import { EbudgetQuotationProductRepository } from 'src/ebudget/ebudget-quotation-product/ebudget-quotation-product.repository';

describe('Ebudget Repositories - Database Migration to mitsuConnection', () => {
    const mockFind = jest.fn().mockResolvedValue([]);
    const mockSave = jest.fn().mockResolvedValue({});
    const mockRepository = {
        find: mockFind,
        findOne: jest.fn().mockResolvedValue(null),
        findOneBy: jest.fn().mockResolvedValue(null),
        save: mockSave,
        createQueryBuilder: jest.fn(),
    };

    const mockDataSource = {
        manager: {
            getRepository: jest.fn().mockReturnValue(mockRepository),
            save: mockSave,
        },
    };

    const repositories = [
        { name: 'SnRepository', repoClass: SnRepository },
        { name: 'BiddingRepository', repoClass: BiddingRepository },
        { name: 'EbgreqattfileRepository', repoClass: EbgreqattfileRepository },
        { name: 'EbgreqcaseRepository', repoClass: EbgreqcaseRepository },
        {
            name: 'EbgreqcolImageRepository',
            repoClass: EbgreqcolImageRepository,
        },
        { name: 'EbgreqformRepository', repoClass: EbgreqformRepository },
        {
            name: 'EbudgetQuotationRepository',
            repoClass: EbudgetQuotationRepository,
        },
        {
            name: 'EbudgetQuotationProductRepository',
            repoClass: EbudgetQuotationProductRepository,
        },
    ];

    describe.each(repositories)(
        '$name Dependency Injection Verification',
        ({ name, repoClass }) => {
            it(`should successfully inject mitsuConnection DataSource into ${name}`, async () => {
                const module: TestingModule = await Test.createTestingModule({
                    providers: [
                        repoClass,
                        {
                            provide: getDataSourceToken('mitsuConnection'),
                            useValue: mockDataSource,
                        },
                    ],
                }).compile();

                const repoInstance = module.get(repoClass);
                expect(repoInstance).toBeDefined();
                expect((repoInstance as any).dataSource).toBe(mockDataSource);
            });

            it(`should fail when only old ebudgetConnection is provided for ${name}`, async () => {
                await expect(
                    Test.createTestingModule({
                        providers: [
                            repoClass,
                            {
                                provide:
                                    getDataSourceToken('ebudgetConnection'),
                                useValue: mockDataSource,
                            },
                        ],
                    }).compile(),
                ).rejects.toThrow();
            });
        },
    );

    describe('All 8 Repositories Query Execution via mitsuConnection', () => {
        let testingModule: TestingModule;

        beforeAll(async () => {
            testingModule = await Test.createTestingModule({
                providers: [
                    SnRepository,
                    BiddingRepository,
                    EbgreqattfileRepository,
                    EbgreqcaseRepository,
                    EbgreqcolImageRepository,
                    EbgreqformRepository,
                    EbudgetQuotationRepository,
                    EbudgetQuotationProductRepository,
                    {
                        provide: getDataSourceToken('mitsuConnection'),
                        useValue: mockDataSource,
                    },
                ],
            }).compile();
        });

        beforeEach(() => {
            mockFind.mockClear();
            mockSave.mockClear();
        });

        it('SnRepository.findAll() should query through mitsuConnection', async () => {
            const repo = testingModule.get<SnRepository>(SnRepository);
            await repo.findAll();
            expect(mockDataSource.manager.getRepository).toHaveBeenCalled();
            expect(mockFind).toHaveBeenCalled();
        });

        it('BiddingRepository.findAll() should query through mitsuConnection', async () => {
            const repo =
                testingModule.get<BiddingRepository>(BiddingRepository);
            await repo.findAll();
            expect(mockDataSource.manager.getRepository).toHaveBeenCalled();
            expect(mockFind).toHaveBeenCalled();
        });

        it('EbgreqattfileRepository.findAll() should query through mitsuConnection', async () => {
            const repo = testingModule.get<EbgreqattfileRepository>(
                EbgreqattfileRepository,
            );
            await repo.findAll();
            expect(mockDataSource.manager.getRepository).toHaveBeenCalled();
            expect(mockFind).toHaveBeenCalled();
        });

        it('EbgreqcaseRepository.findAll() should query through mitsuConnection', async () => {
            const repo =
                testingModule.get<EbgreqcaseRepository>(EbgreqcaseRepository);
            await repo.findAll();
            expect(mockDataSource.manager.getRepository).toHaveBeenCalled();
            expect(mockFind).toHaveBeenCalled();
        });

        it('EbgreqcolImageRepository.findAll() should query through mitsuConnection', async () => {
            const repo = testingModule.get<EbgreqcolImageRepository>(
                EbgreqcolImageRepository,
            );
            await repo.findAll();
            expect(mockDataSource.manager.getRepository).toHaveBeenCalled();
            expect(mockFind).toHaveBeenCalled();
        });

        it('EbgreqformRepository.findOne() should query through mitsuConnection', async () => {
            const repo =
                testingModule.get<EbgreqformRepository>(EbgreqformRepository);
            await repo.findOne({
                NFRMNO: 1,
                VORGNO: 'ORG',
                CYEAR: '26',
                CYEAR2: '2026',
                NRUNNO: 1,
            });
            expect(mockDataSource.manager.getRepository).toHaveBeenCalled();
            expect(mockRepository.findOneBy).toHaveBeenCalled();
        });

        it('EbudgetQuotationRepository.getData() should query through mitsuConnection', async () => {
            const repo = testingModule.get<EbudgetQuotationRepository>(
                EbudgetQuotationRepository,
            );
            await repo.getData({ ID: 1 } as any);
            expect(mockDataSource.manager.getRepository).toHaveBeenCalled();
            expect(mockFind).toHaveBeenCalled();
        });

        it('EbudgetQuotationProductRepository.getData() should query through mitsuConnection', async () => {
            const repo = testingModule.get<EbudgetQuotationProductRepository>(
                EbudgetQuotationProductRepository,
            );
            await repo.getData(101);
            expect(mockDataSource.manager.getRepository).toHaveBeenCalled();
            expect(mockFind).toHaveBeenCalled();
        });
    });
});
