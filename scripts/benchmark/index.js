/**
 * System Startup & Database Benchmark Utility
 * -------------------------------------------
 * รันเพื่อวัดความเร็วในการเชื่อมต่อ Database แต่ละตัว
 * และวัดความเร็วแต่ละขั้นตอนการบูตระบบ NestJS บนเครื่องใดๆ
 *
 * วิธีใช้:
 * 1. npm run build (ถ้ายังไม่เคย build)
 * 2. npm run benchmark (หรือ node scripts/benchmark/index.js)
 */

require('dotenv').config();
const { performance } = require('perf_hooks');
const path = require('path');
const fs = require('fs');

async function testConnection(name, config, pingQuery) {
    const { DataSource } = require('typeorm');
    const t0 = performance.now();
    let ds;
    try {
        const tStartInit = performance.now();
        ds = new DataSource({
            ...config,
            entities: [],
            synchronize: false,
        });
        await ds.initialize();
        const initTime = performance.now() - tStartInit;

        const tStartQuery = performance.now();
        await ds.query(pingQuery);
        const queryTime = performance.now() - tStartQuery;

        const totalTime = performance.now() - t0;
        await ds.destroy();
        return {
            'Database Connection': name,
            'DB Type': config.type,
            'Connect (ms)': +initTime.toFixed(2),
            'Ping (ms)': +queryTime.toFixed(2),
            'Total (ms)': +totalTime.toFixed(2),
            'Status': 'OK ✅',
        };
    } catch (err) {
        const failTime = performance.now() - t0;
        if (ds && ds.isInitialized) {
            try { await ds.destroy(); } catch (_) {}
        }
        return {
            'Database Connection': name,
            'DB Type': config.type,
            'Connect (ms)': '-',
            'Ping (ms)': '-',
            'Total (ms)': +failTime.toFixed(2),
            'Status': 'FAILED ❌',
            'Error': err.message?.split('\n')[0] || 'Unknown error',
        };
    }
}

async function runDatabaseBenchmark() {
    console.log('\n======================================================');
    console.log('📊 1. BENCHMARKING DATABASE CONNECTIONS');
    console.log('======================================================');

    const dbConfigs = [
        {
            name: 'mitsuConnection',
            config: {
                type: 'oracle',
                username: process.env.MITSU_USER,
                password: process.env.MITSU_PASSWORD,
                schema: process.env.MITSU_SCHEMA,
                connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.MITSU_HOST})(PORT=${process.env.MITSU_PORT}))(CONNECT_DATA=(SID=${process.env.MITSU_SERVICE})))`,
            },
            ping: 'SELECT 1 FROM DUAL',
        },
        {
            name: 'datacenterConnection',
            config: {
                type: 'oracle',
                username: process.env.DATACENTER_USER,
                password: process.env.DATACENTER_PASSWORD,
                schema: process.env.DATACENTER_SCHEMA,
                connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.DATACENTER_HOST})(PORT=${process.env.DATACENTER_PORT}))(CONNECT_DATA=(SID=${process.env.DATACENTER_SERVICE})))`,
            },
            ping: 'SELECT 1 FROM DUAL',
        },
        {
            name: 'elmesConnection',
            config: {
                type: 'oracle',
                username: process.env.ELMES_USER,
                password: process.env.ELMES_PASSWORD,
                schema: process.env.ELMES_SCHEMA,
                connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.ELMES_HOST})(PORT=${process.env.ELMES_PORT}))(CONNECT_DATA=(SID=${process.env.ELMES_SERVICE})))`,
            },
            ping: 'SELECT 1 FROM DUAL',
        },
        {
            name: 'pdmConnection',
            config: {
                type: 'postgres',
                host: process.env.PDM_HOST,
                port: +process.env.PDM_PORT || 5432,
                username: process.env.PDM_USER,
                password: process.env.PDM_PASSWORD,
                database: process.env.PDM_SERVICE,
                schema: process.env.PDM_SCHEMA,
            },
            ping: 'SELECT 1',
        },
        {
            name: 'auditConnection',
            config: {
                type: 'mssql',
                host: process.env.AUD_HOST,
                port: Number(process.env.AUD_PORT) || 1433,
                username: process.env.AUD_USER,
                password: process.env.AUD_PASSWORD,
                database: process.env.AUD_DATABASE || process.env.AUD_SERVICE,
                options: {
                    instanceName: process.env.AUD_INSTANCE,
                    encrypt: false,
                    enableArithAbort: true,
                    trustServerCertificate: true,
                },
            },
            ping: 'SELECT 1 as ping',
        },
        {
            name: 'lnConnection',
            config: {
                type: 'mssql',
                host: process.env.LN_HOST,
                port: Number(process.env.LN_PORT) || 1433,
                username: process.env.LN_USER,
                password: process.env.LN_PASSWORD,
                database: process.env.LN_DATABASE || process.env.LN_SERVICE,
                options: {
                    instanceName: process.env.LN_INSTANCE,
                    encrypt: false,
                    enableArithAbort: true,
                    trustServerCertificate: true,
                },
            },
            ping: 'SELECT 1 as ping',
        },
        {
            name: 'packingConnection',
            config: {
                type: 'mssql',
                host: process.env.PACKING_HOST,
                port: Number(process.env.PACKING_PORT) || 1433,
                username: process.env.PACKING_USER,
                password: process.env.PACKING_PASSWORD,
                database: process.env.PACKING_DATABASE,
                options: {
                    instanceName: process.env.PACKING_INSTANCE,
                    encrypt: false,
                    enableArithAbort: true,
                    trustServerCertificate: true,
                },
            },
            ping: 'SELECT 1 as ping',
        },
        {
            name: 'fingerConnection',
            config: {
                type: 'mssql',
                host: process.env.FPRINST_HOST,
                port: Number(process.env.FPRINST_PORT) || 1433,
                username: process.env.FPRINST_USER,
                password: process.env.FPRINST_PASSWORD,
                database: process.env.FPRINST_DATABASE || process.env.FPRINST_SERVICE,
                options: {
                    instanceName: process.env.FPRINST_INSTANCE,
                    encrypt: false,
                    enableArithAbort: true,
                    trustServerCertificate: true,
                },
            },
            ping: 'SELECT 1 as ping',
        },
    ];

    const results = [];
    for (const item of dbConfigs) {
        process.stdout.write(`⏳ Testing [${item.name}] (${item.config.type})... `);
        const res = await testConnection(item.name, item.config, item.ping);
        console.log(res.Status);
        results.push(res);
    }

    console.log('\n--- Database Benchmark Summary ---');
    console.table(results);
}

async function runStartupBenchmark() {
    console.log('\n======================================================');
    console.log('🚀 2. BENCHMARKING NESTJS APPLICATION STARTUP PHASES');
    console.log('======================================================\n');

    let appModulePath = path.resolve(process.cwd(), 'dist/app.module.js');
    if (!fs.existsSync(appModulePath)) {
        appModulePath = path.resolve(process.cwd(), 'dist/src/app.module.js');
    }
    if (!fs.existsSync(appModulePath)) {
        console.error('❌ ไม่พบไฟล์ dist/app.module.js กรุณารัน "npm run build" ก่อนเพื่อคอมไพล์โค้ดล่าสุด');
        return;
    }

    const t0 = performance.now();

    // Phase 1: Oracle Client Init
    const t0_oracle = performance.now();
    if (process.env.HOST !== 'HOME') {
        try {
            const oracledb = require('oracledb');
            oracledb.initOracleClient({
                libDir: process.env.ORACLE_CLIENT_LIB_DIR || 'C:/oracle/instantclient_23_0',
            });
        } catch (_) {}
    }
    const t_oracle = performance.now() - t0_oracle;

    // Phase 2: Require/Import Module Graph
    const t0_import = performance.now();
    const { NestFactory } = require('@nestjs/core');
    const { AppModule } = require(appModulePath);
    const t_import = performance.now() - t0_import;

    // Phase 3: NestFactory.create (DI Resolution & Providers)
    const t0_create = performance.now();
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn'],
    });
    const t_create = performance.now() - t0_create;

    // Phase 4: app.init() (TypeORM DB Connections, Metadata & Lifecycle hooks)
    const t0_init = performance.now();
    await app.init();
    const t_init = performance.now() - t0_init;

    const totalTime = performance.now() - t0;

    const phaseResults = [
        {
            Phase: 'Phase 1: Oracle Client Init',
            'Time (ms)': +t_oracle.toFixed(2),
            'Time (sec)': +(t_oracle / 1000).toFixed(2),
            '% Ratio': +((t_oracle / totalTime) * 100).toFixed(1) + '%',
        },
        {
            Phase: 'Phase 2: Code Import & Modules Evaluation',
            'Time (ms)': +t_import.toFixed(2),
            'Time (sec)': +(t_import / 1000).toFixed(2),
            '% Ratio': +((t_import / totalTime) * 100).toFixed(1) + '%',
        },
        {
            Phase: 'Phase 3: DI Resolution & NestFactory.create',
            'Time (ms)': +t_create.toFixed(2),
            'Time (sec)': +(t_create / 1000).toFixed(2),
            '% Ratio': +((t_create / totalTime) * 100).toFixed(1) + '%',
        },
        {
            Phase: 'Phase 4: app.init() (DB Pools & TypeORM)',
            'Time (ms)': +t_init.toFixed(2),
            'Time (sec)': +(t_init / 1000).toFixed(2),
            '% Ratio': +((t_init / totalTime) * 100).toFixed(1) + '%',
        },
    ];

    console.log('--- Startup Phases Summary ---');
    console.table(phaseResults);

    console.log(`\n🎉 TOTAL TIME TO READY: ${(totalTime / 1000).toFixed(2)} วินาที (${totalTime.toFixed(2)} ms)\n`);

    // Clean exit
    try {
        await app.close();
    } catch (_) {}
}

async function main() {
    try {
        await runDatabaseBenchmark();
        await runStartupBenchmark();
        process.exit(0);
    } catch (err) {
        console.error('Fatal error:', err);
        process.exit(1);
    }
}

main();

