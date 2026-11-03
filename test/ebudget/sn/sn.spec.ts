import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { SnRepository } from 'src/ebudget/sn/sn.repository';
import { SnService } from 'src/ebudget/sn/sn.service';
import { SnController } from 'src/ebudget/sn/sn.controller';
import { EBUDGET_DATA_SN } from 'src/common/Entities/ebudget/views/EBUDGET_DATA_SN.entity';

describe('SnModule - MitsuConnection Unit Tests', () => {
    let service: SnService;
    let repository: SnRepository;
    let controller: SnController;

    const mockFind = jest.fn();
    const mockRepoInstance = {
        find: mockFind,
    };

    const mockDataSource = {
        manager: {
            getRepository: jest.fn().mockImplementation((entity) => {
                if (entity === EBUDGET_DATA_SN) {
                    return mockRepoInstance;
                }
                return {};
            }),
        },
    };

    beforeEach(async () => {
        mockFind.mockReset();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [SnController],
            providers: [
                SnService,
                SnRepository,
                {
                    provide: getDataSourceToken('mitsuConnection'),
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        service = module.get<SnService>(SnService);
        repository = module.get<SnRepository>(SnRepository);
        controller = module.get<SnController>(SnController);
    });

    it('should successfully resolve SnRepository and SnService using mitsuConnection', () => {
        expect(repository).toBeDefined();
        expect(service).toBeDefined();
        expect(controller).toBeDefined();
        // ตรวจสอบว่า repository ได้รับ DataSource ตัวจำลองของ mitsuConnection
        expect((repository as any).dataSource).toBe(mockDataSource);
    });

    it('should fail resolution if mitsuConnection is not provided (ensuring it does not fallback to ebudgetConnection)', async () => {
        // ทดสอบว่าถ้า provide ด้วยชื่อเก่า 'ebudgetConnection' จะต้อง compile ไม่ผ่านเพราะต้องการ 'mitsuConnection'
        await expect(
            Test.createTestingModule({
                providers: [
                    SnRepository,
                    {
                        provide: getDataSourceToken('ebudgetConnection'),
                        useValue: mockDataSource,
                    },
                ],
            }).compile(),
        ).rejects.toThrow();
    });

    it('findAll should return array of SN ordered by FYEAR and SN', async () => {
        const dummyData = [
            { FYEAR: '2026', SN: 'SN-001', VORGCODE: 'ORG1', CSTATUS: '1' },
            { FYEAR: '2026', SN: 'SN-002', VORGCODE: 'ORG1', CSTATUS: '1' },
        ];
        mockFind.mockResolvedValueOnce(dummyData);

        const result = await service.findAll();

        expect(mockFind).toHaveBeenCalledWith({
            order: { FYEAR: 'ASC', SN: 'ASC' },
        });
        expect(result).toEqual(dummyData);
    });

    it('getDataSn should filter by VORGCODE, FYEAR and CSTATUS=1', async () => {
        const dummyData = [
            { FYEAR: '2026', SN: 'SN-001', VORGCODE: 'DEPT01', CSTATUS: '1' },
        ];
        mockFind.mockResolvedValueOnce(dummyData);

        const queryDto = { VORGCODE: 'DEPT01', FYEAR: '2026' };
        const result = await service.getDataSn(queryDto);

        expect(mockFind).toHaveBeenCalledWith({
            where: {
                VORGCODE: 'DEPT01',
                FYEAR: '2026',
                CSTATUS: '1',
            },
            order: { SN: 'ASC' },
        });
        expect(result).toEqual(dummyData);
    });
});

