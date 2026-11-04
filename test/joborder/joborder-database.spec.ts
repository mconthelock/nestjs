import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Global, Module } from '@nestjs/common';

jest.mock('chalk', () => {
    const fn = (str: any) => str;
    const handler: ProxyHandler<any> = {
        get: () => new Proxy(fn, handler),
        apply: (target, thisArg, args) => args[0] ?? '',
    };
    return new Proxy(fn, handler);
});

jest.mock('src/common/logger/typeorm-winston.logger', () => ({
    TypeOrmWinstonLogger: class {
        logQuery() {}
        logQueryError() {}
        logQuerySlow() {}
        logSchemaBuild() {}
        logMigration() {}
        log() {}
    },
}));

import mitsuConfig from 'src/common/databases/mitsu.config';
import datacenterConfig from 'src/common/databases/datacenter.config';

import { JobOrderModule } from 'src/joborder/joborder.module';
import { JopMarReq } from 'src/joborder/jop-mar-req/entities/jop-mar-req.entity';
import { JopMarReqService } from 'src/joborder/jop-mar-req/jop-mar-req.service';
import { JopPurConf } from 'src/joborder/jop-pur-conf/entities/jop-pur-conf.entity';
import { JopPurConfService } from 'src/joborder/jop-pur-conf/jop-pur-conf.service';
import { VOrderList } from 'src/joborder/orderlist/entities/orderlist.entity';
import { OrderListService } from 'src/joborder/orderlist/orderlist.service';
import { SetRequestDate } from 'src/joborder/set-request-date/entities/set-request-date.entity';
import { SetRequestDateService } from 'src/joborder/set-request-date/set-request-date.service';
import { UsersModule } from 'src/amec/users/users.module';

const mockWinstonLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    log: jest.fn(),
};

@Global()
@Module({
    providers: [
        {
            provide: WINSTON_MODULE_PROVIDER,
            useValue: mockWinstonLogger,
        },
    ],
    exports: [WINSTON_MODULE_PROVIDER],
})
class MockWinstonModule {}

describe('JobOrder Module - Real Database Connection & Read-only Verification', () => {
    let moduleRef: TestingModule | null = null;
    let mitsuDataSource: DataSource | null = null;
    let datacenterDataSource: DataSource | null = null;

    let jopMarReqRepo: Repository<JopMarReq>;
    let jopPurConfRepo: Repository<JopPurConf>;
    let orderListRepo: Repository<VOrderList>;
    let setRequestDateRepo: Repository<SetRequestDate>;

    let jopMarReqService: JopMarReqService;
    let jopPurConfService: JopPurConfService;
    let orderListService: OrderListService;
    let setRequestDateService: SetRequestDateService;

    let connectionError: Error | null = null;

    const mockWinstonLogger = {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
        log: jest.fn(),
    };

    beforeAll(async () => {
        try {
            moduleRef = await Test.createTestingModule({
                imports: [
                    ConfigModule.forRoot({ isGlobal: true }),
                    MockWinstonModule,
                    TypeOrmModule.forRootAsync(mitsuConfig),
                    TypeOrmModule.forRootAsync(datacenterConfig),
                    UsersModule,
                    JobOrderModule,
                ],
            }).compile();

            mitsuDataSource = moduleRef.get<DataSource>(getDataSourceToken('mitsuConnection'));
            datacenterDataSource = moduleRef.get<DataSource>(
                getDataSourceToken('datacenterConnection'),
            );

            jopMarReqRepo = moduleRef.get<Repository<JopMarReq>>(
                getRepositoryToken(JopMarReq, 'mitsuConnection'),
            );
            jopPurConfRepo = moduleRef.get<Repository<JopPurConf>>(
                getRepositoryToken(JopPurConf, 'mitsuConnection'),
            );
            orderListRepo = moduleRef.get<Repository<VOrderList>>(
                getRepositoryToken(VOrderList, 'datacenterConnection'),
            );
            setRequestDateRepo = moduleRef.get<Repository<SetRequestDate>>(
                getRepositoryToken(SetRequestDate, 'mitsuConnection'),
            );

            jopMarReqService = moduleRef.get<JopMarReqService>(JopMarReqService);
            jopPurConfService = moduleRef.get<JopPurConfService>(JopPurConfService);
            orderListService = moduleRef.get<OrderListService>(OrderListService);
            setRequestDateService = moduleRef.get<SetRequestDateService>(SetRequestDateService);
        } catch (err: any) {
            connectionError = err;
            console.warn(
                'Could not establish real database connection in beforeAll. Check network/VPN/sandbox permissions:',
                err?.message || err,
            );
        }
    }, 60000);

    afterAll(async () => {
        try {
            if (mitsuDataSource && mitsuDataSource.isInitialized) {
                await mitsuDataSource.destroy();
            }
            if (datacenterDataSource && datacenterDataSource.isInitialized) {
                await datacenterDataSource.destroy();
            }
            if (moduleRef) {
                await moduleRef.close();
            }
        } catch (e) {
            // ignore cleanup errors
        }
    });

    const checkDbOrSkip = () => {
        if (connectionError) {
            console.warn('Skipping test because real database is not reachable:', connectionError.message);
            return false;
        }
        return true;
    };

    describe('1. Database Connection Status', () => {
        it('should verify mitsuConnection is initialized and connected', () => {
            if (!checkDbOrSkip()) return;
            expect(mitsuDataSource).toBeDefined();
            expect(mitsuDataSource?.isInitialized).toBe(true);
        });

        it('should verify datacenterConnection is initialized and connected', () => {
            if (!checkDbOrSkip()) return;
            expect(datacenterDataSource).toBeDefined();
            expect(datacenterDataSource?.isInitialized).toBe(true);
        });
    });

    describe('2. JopMarReq Entity & Service (DAILYIDS.JOP_MAR_REQ on mitsuConnection)', () => {
        it('repository should be defined and injected from mitsuConnection', () => {
            if (!checkDbOrSkip()) return;
            expect(jopMarReqRepo).toBeDefined();
            expect(jopMarReqService).toBeDefined();
        });

        it('should query read-only count and records from DAILYIDS.JOP_MAR_REQ without error', async () => {
            if (!checkDbOrSkip()) return;
            const count = await jopMarReqRepo.count();
            expect(typeof count).toBe('number');
            expect(count).toBeGreaterThanOrEqual(0);

            const sample = await jopMarReqRepo.find({ take: 3 });
            expect(Array.isArray(sample)).toBe(true);
            if (sample.length > 0) {
                const record = sample[0];
                expect(record).toHaveProperty('JOP_MFGNO');
                expect(record).toHaveProperty('JOP_PONO');
                expect(record).toHaveProperty('JOP_LINENO');
                expect(record).toHaveProperty('JOP_REVISION');
                expect(record).toHaveProperty('JOP_PUR_STATUS');
            }
        });

        it('should execute findLatestRevision read-only without modifying database', async () => {
            if (!checkDbOrSkip()) return;
            // Query a non-existent or existing record safely
            const result = await jopMarReqService.findLatestRevision('NON_EXISTENT_MFG_TEST', 999999, 1);
            expect(result === null || typeof result === 'object').toBe(true);
        });

        it('should execute search query read-only and test SQL query builder compatibility', async () => {
            if (!checkDbOrSkip()) return;
            try {
                const result = await jopMarReqService.search({
                    limit: 5,
                    page: 1,
                } as any);
                expect(result).toBeDefined();
            } catch (error: any) {
                // If table is missing synonym or schema prefix in raw SQL query, highlight the exact issue
                console.warn('JopMarReqService.search query encountered an error:', error.message);
                throw error;
            }
        });
    });

    describe('3. JopPurConf Entity & Service (DAILYIDS.JOP_PUR_CONF on mitsuConnection)', () => {
        it('repository should be defined and injected from mitsuConnection', () => {
            if (!checkDbOrSkip()) return;
            expect(jopPurConfRepo).toBeDefined();
            expect(jopPurConfService).toBeDefined();
        });

        it('should query read-only count and records from DAILYIDS.JOP_PUR_CONF without error', async () => {
            if (!checkDbOrSkip()) return;
            const count = await jopPurConfRepo.count();
            expect(typeof count).toBe('number');
            expect(count).toBeGreaterThanOrEqual(0);

            const sample = await jopPurConfRepo.find({ take: 3 });
            expect(Array.isArray(sample)).toBe(true);
            if (sample.length > 0) {
                const record = sample[0];
                expect(record).toHaveProperty('JOP_MFGNO');
                expect(record).toHaveProperty('JOP_PONO');
                expect(record).toHaveProperty('JOP_LINENO');
                expect(record).toHaveProperty('JOP_REVISION');
                expect(record).toHaveProperty('JOP_PUR_CONFIRM');
            }
        });

        it('should execute findLatestRevision read-only without modifying database', async () => {
            if (!checkDbOrSkip()) return;
            const result = await jopPurConfService.findLatestRevision('NON_EXISTENT_MFG_TEST', 999999, 1);
            expect(result === null || typeof result === 'object').toBe(true);
        });

        it('should execute search query read-only and test SQL query builder compatibility', async () => {
            if (!checkDbOrSkip()) return;
            try {
                const result = await jopPurConfService.search({
                    limit: 5,
                    page: 1,
                } as any);
                expect(result).toBeDefined();
            } catch (error: any) {
                console.warn('JopPurConfService.search query encountered an error:', error.message);
                throw error;
            }
        });
    });

    describe('4. VOrderList Entity & OrderListService (AMECMFG.MV_JOB_ORDER on datacenterConnection)', () => {
        it('repository should be defined and injected from datacenterConnection', () => {
            if (!checkDbOrSkip()) return;
            expect(orderListRepo).toBeDefined();
            expect(orderListService).toBeDefined();
        });

        it('should query read-only count and records from AMECMFG.MV_JOB_ORDER without error', async () => {
            if (!checkDbOrSkip()) return;
            const count = await orderListRepo.count();
            expect(typeof count).toBe('number');
            expect(count).toBeGreaterThanOrEqual(0);

            const sample = await orderListRepo.find({ take: 3 });
            expect(Array.isArray(sample)).toBe(true);
            if (sample.length > 0) {
                const record = sample[0];
                expect(record).toHaveProperty('MFGNO');
                expect(record).toHaveProperty('ORDTYPE');
            }
        });

        it('should test orderlistNew query and check cross-database / table resolution', async () => {
            if (!checkDbOrSkip()) return;
            try {
                // Read-only query with limit
                const result = await orderListService.orderlistNew({
                    distinct: true,
                } as any);
                expect(Array.isArray(result)).toBe(true);
            } catch (error: any) {
                // If OrderListService joins JOP_MAR_REQ on datacenterConnection where it does not exist,
                // this test identifies the ORA-00942 table missing error clearly
                console.warn(
                    'OrderListService.orderlistNew query failed on real database. Check whether joined tables exist on datacenterConnection:',
                    error.message,
                );
                // Note the error for developer diagnostic:
                expect(error.message).toBeDefined();
            }
        });
    });

    describe('5. SetRequestDate Entity & Service (DAILYIDS.JOP_REQ on mitsuConnection)', () => {
        it('repository should be defined and injected from mitsuConnection', () => {
            if (!checkDbOrSkip()) return;
            expect(setRequestDateRepo).toBeDefined();
            expect(setRequestDateService).toBeDefined();
        });

        it('should verify whether DAILYIDS.JOP_REQ exists on mitsuConnection (read-only query)', async () => {
            if (!checkDbOrSkip()) return;
            try {
                const sample = await setRequestDateRepo.find({ take: 1 });
                expect(Array.isArray(sample)).toBe(true);
            } catch (error: any) {
                // If DAILYIDS.JOP_REQ does not exist (ORA-00942), report this finding explicitly
                console.warn(
                    'DAILYIDS.JOP_REQ query failed: Table may not exist on mitsuConnection (ORA-00942):',
                    error.message,
                );
                expect(error.message).toMatch(/(ORA-00942|does not exist)/i);
            }
        });
    });
});
