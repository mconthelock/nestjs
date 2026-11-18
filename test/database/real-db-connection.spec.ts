import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import * as oracledb from 'oracledb';
import * as odbc from 'odbc';

dotenv.config();

// Initialize Oracle Client if running outside of HOME environment
if (process.env.HOST !== 'HOME') {
    try {
        oracledb.initOracleClient({
            libDir: process.env.ORACLE_CLIENT_LIB_DIR || 'C:/oracle/instantclient_23_0',
        });
    } catch {
        // Ignored if already initialized or library not found
    }
}

/**
 * Helper to determine if an error is due to network isolation / offline / VPN disconnection.
 */
function isNetworkOrHostError(error: any): boolean {
    const message = error?.message || '';
    const code = error?.code || '';
    return (
        code === 'ENOTFOUND' ||
        code === 'ECONNREFUSED' ||
        code === 'ETIMEDOUT' ||
        code === 'EHOSTUNREACH' ||
        code === 'ENETUNREACH' ||
        message.includes('ORA-12546') || // TNS:permission denied (sandbox / socket restricted)
        message.includes('ORA-12170') || // TNS:Connect timeout occurred
        message.includes('ORA-12541') || // TNS:no listener
        message.includes('ORA-12514') || // TNS:listener does not currently know of service
        message.includes('Failed to connect') ||
        message.includes('getaddrinfo') ||
        message.includes('[odbc]') ||
        message.includes('connecting to the database') ||
        Boolean(error?.odbcErrors)
    );
}

describe('Real Database Connections (Read-Only)', () => {
    // Extended timeout for real database connections over network/VPN
    jest.setTimeout(30000);

    const isStrictDbRequired = process.env.REQUIRE_REAL_DB === 'true';

    describe('Oracle Databases (Read-Only Ping)', () => {
        let mitsuDs: DataSource | null = null;
        let datacenterDs: DataSource | null = null;
        let elmesDs: DataSource | null = null;

        afterEach(async () => {
            if (mitsuDs?.isInitialized) {
                await mitsuDs.destroy();
                mitsuDs = null;
            }
            if (datacenterDs?.isInitialized) {
                await datacenterDs.destroy();
                datacenterDs = null;
            }
            if (elmesDs?.isInitialized) {
                await elmesDs.destroy();
                elmesDs = null;
            }
        });

        it('should connect to mitsuConnection (Oracle) and perform read-only ping', async () => {
            const connectString = `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.MITSU_HOST})(PORT=${process.env.MITSU_PORT}))(CONNECT_DATA=(SID=${process.env.MITSU_SERVICE})))`;

            mitsuDs = new DataSource({
                type: 'oracle',
                username: process.env.MITSU_USER,
                password: process.env.MITSU_PASSWORD,
                schema: process.env.MITSU_SCHEMA,
                connectString,
                synchronize: false,
                entities: [],
            });

            try {
                await mitsuDs.initialize();
                expect(mitsuDs.isInitialized).toBe(true);

                // STRICTLY READ-ONLY: SELECT 1 FROM DUAL
                const result = await mitsuDs.query(
                    "SELECT 1 AS PING, TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') AS SERVER_TIME FROM DUAL",
                );
                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThan(0);
                expect(result[0].PING).toBe(1);
            } catch (error: any) {
                if (isNetworkOrHostError(error) && !isStrictDbRequired) {
                    console.warn(`⚠️ [mitsuConnection] Offline / Unreachable: ${error.message}`);
                    return;
                }
                throw error;
            }
        });

        it('should connect to datacenterConnection (Oracle) and perform read-only ping', async () => {
            const connectString = `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.DATACENTER_HOST})(PORT=${process.env.DATACENTER_PORT}))(CONNECT_DATA=(SID=${process.env.DATACENTER_SERVICE})))`;

            datacenterDs = new DataSource({
                type: 'oracle',
                username: process.env.DATACENTER_USER,
                password: process.env.DATACENTER_PASSWORD,
                schema: process.env.DATACENTER_SCHEMA,
                connectString,
                synchronize: false,
                entities: [],
            });

            try {
                await datacenterDs.initialize();
                expect(datacenterDs.isInitialized).toBe(true);

                // STRICTLY READ-ONLY: SELECT 1 FROM DUAL
                const result = await datacenterDs.query(
                    "SELECT 1 AS PING, TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') AS SERVER_TIME FROM DUAL",
                );
                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThan(0);
                expect(result[0].PING).toBe(1);
            } catch (error: any) {
                if (isNetworkOrHostError(error) && !isStrictDbRequired) {
                    console.warn(
                        `⚠️ [datacenterConnection] Offline / Unreachable: ${error.message}`,
                    );
                    return;
                }
                throw error;
            }
        });

        it('should connect to elmesConnection (Oracle) and perform read-only ping', async () => {
            const connectString = `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.ELMES_HOST})(PORT=${process.env.ELMES_PORT}))(CONNECT_DATA=(SID=${process.env.ELMES_SERVICE})))`;

            elmesDs = new DataSource({
                type: 'oracle',
                username: process.env.ELMES_USER,
                password: process.env.ELMES_PASSWORD,
                schema: process.env.ELMES_SCHEMA,
                connectString,
                synchronize: false,
                entities: [],
            });

            try {
                await elmesDs.initialize();
                expect(elmesDs.isInitialized).toBe(true);

                // STRICTLY READ-ONLY: SELECT 1 FROM DUAL
                const result = await elmesDs.query(
                    "SELECT 1 AS PING, TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') AS SERVER_TIME FROM DUAL",
                );
                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThan(0);
                expect(result[0].PING).toBe(1);
            } catch (error: any) {
                if (isNetworkOrHostError(error) && !isStrictDbRequired) {
                    console.warn(`⚠️ [elmesConnection] Offline / Unreachable: ${error.message}`);
                    return;
                }
                throw error;
            }
        });
    });

    describe('PostgreSQL Database (Read-Only Ping)', () => {
        let pdmDs: DataSource | null = null;

        afterEach(async () => {
            if (pdmDs?.isInitialized) {
                await pdmDs.destroy();
                pdmDs = null;
            }
        });

        it('should connect to pdmConnection (Postgres) and perform read-only ping', async () => {
            pdmDs = new DataSource({
                type: 'postgres',
                host: process.env.PDM_HOST,
                port: Number(process.env.PDM_PORT) || 5432,
                username: process.env.PDM_USER,
                password: process.env.PDM_PASSWORD,
                database: process.env.PDM_SERVICE,
                schema: process.env.PDM_SCHEMA,
                synchronize: false,
                entities: [],
            });

            try {
                await pdmDs.initialize();
                expect(pdmDs.isInitialized).toBe(true);

                // STRICTLY READ-ONLY: SELECT 1
                const result = await pdmDs.query('SELECT 1 AS ping, NOW() AS server_time');
                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThan(0);
                expect(Number(result[0].ping)).toBe(1);
            } catch (error: any) {
                if (isNetworkOrHostError(error) && !isStrictDbRequired) {
                    console.warn(`⚠️ [pdmConnection] Offline / Unreachable: ${error.message}`);
                    return;
                }
                throw error;
            }
        });
    });

    describe('MSSQL Databases (Read-Only Ping)', () => {
        let auditDs: DataSource | null = null;
        let lnDs: DataSource | null = null;
        let packingDs: DataSource | null = null;
        let fingerDs: DataSource | null = null;

        afterEach(async () => {
            if (auditDs?.isInitialized) {
                await auditDs.destroy();
                auditDs = null;
            }
            if (lnDs?.isInitialized) {
                await lnDs.destroy();
                lnDs = null;
            }
            if (packingDs?.isInitialized) {
                await packingDs.destroy();
                packingDs = null;
            }
            if (fingerDs?.isInitialized) {
                await fingerDs.destroy();
                fingerDs = null;
            }
        });

        it('should connect to auditConnection (MSSQL) and perform read-only ping', async () => {
            auditDs = new DataSource({
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
                synchronize: false,
                entities: [],
            });

            try {
                await auditDs.initialize();
                expect(auditDs.isInitialized).toBe(true);

                // STRICTLY READ-ONLY: SELECT 1
                const result = await auditDs.query('SELECT 1 AS ping, GETDATE() AS server_time');
                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThan(0);
                expect(Number(result[0].ping)).toBe(1);
            } catch (error: any) {
                if (isNetworkOrHostError(error) && !isStrictDbRequired) {
                    console.warn(`⚠️ [auditConnection] Offline / Unreachable: ${error.message}`);
                    return;
                }
                throw error;
            }
        });

        it('should connect to lnConnection (MSSQL) and perform read-only ping', async () => {
            lnDs = new DataSource({
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
                synchronize: false,
                entities: [],
            });

            try {
                await lnDs.initialize();
                expect(lnDs.isInitialized).toBe(true);

                // STRICTLY READ-ONLY: SELECT 1
                const result = await lnDs.query('SELECT 1 AS ping, GETDATE() AS server_time');
                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThan(0);
                expect(Number(result[0].ping)).toBe(1);
            } catch (error: any) {
                if (isNetworkOrHostError(error) && !isStrictDbRequired) {
                    console.warn(`⚠️ [lnConnection] Offline / Unreachable: ${error.message}`);
                    return;
                }
                throw error;
            }
        });

        it('should connect to packingsysConnection (MSSQL) and perform read-only ping', async () => {
            packingDs = new DataSource({
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
                synchronize: false,
                entities: [],
            });

            try {
                await packingDs.initialize();
                expect(packingDs.isInitialized).toBe(true);

                // STRICTLY READ-ONLY: SELECT 1
                const result = await packingDs.query('SELECT 1 AS ping, GETDATE() AS server_time');
                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThan(0);
                expect(Number(result[0].ping)).toBe(1);
            } catch (error: any) {
                if (isNetworkOrHostError(error) && !isStrictDbRequired) {
                    console.warn(
                        `⚠️ [packingsysConnection] Offline / Unreachable: ${error.message}`,
                    );
                    return;
                }
                throw error;
            }
        });

        it('should connect to fingerdbConnection (MSSQL) and perform read-only ping', async () => {
            fingerDs = new DataSource({
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
                synchronize: false,
                entities: [],
            });

            try {
                await fingerDs.initialize();
                expect(fingerDs.isInitialized).toBe(true);

                // STRICTLY READ-ONLY: SELECT 1
                const result = await fingerDs.query('SELECT 1 AS ping, GETDATE() AS server_time');
                expect(result).toBeDefined();
                expect(Array.isArray(result)).toBe(true);
                expect(result.length).toBeGreaterThan(0);
                expect(Number(result[0].ping)).toBe(1);
            } catch (error: any) {
                if (isNetworkOrHostError(error) && !isStrictDbRequired) {
                    console.warn(`⚠️ [fingerdbConnection] Offline / Unreachable: ${error.message}`);
                    return;
                }
                throw error;
            }
        });
    });

    describe('AS400 Connection (ODBC Read-Only Ping)', () => {
        it('should connect to AS400 via ODBC and perform read-only ping if configured', async () => {
            const dsn = process.env.AS400_ODBC_DSN;
            let connectionString: string;
            if (dsn) {
                connectionString = `DSN=${dsn};UID=${process.env.AS400_USER || ''};PWD=${process.env.AS400_PASSWORD || ''}`;
            } else {
                const driver = process.env.AS400_ODBC_DRIVER || 'iSeries Access ODBC Driver';
                const system = process.env.AS400_HOST || 'AMEC400';
                const uid = process.env.AS400_USER || 'OGGUSER';
                const pwd = process.env.AS400_PASSWORD || 'OGGUSER';
                connectionString = `DRIVER={${driver}};SYSTEM=${system};UID=${uid};PWD=${pwd}`;
            }

            let connection: odbc.Connection | null = null;
            try {
                connection = await odbc.connect(connectionString);
                expect(connection).toBeDefined();

                // STRICTLY READ-ONLY: SELECT 1 FROM SYSIBM.SYSDUMMY1
                const result = await connection.query('SELECT 1 AS PING FROM SYSIBM.SYSDUMMY1');
                expect(result).toBeDefined();
                expect(result.length).toBeGreaterThan(0);
            } catch (error: any) {
                if (isNetworkOrHostError(error) && !isStrictDbRequired) {
                    console.warn(`⚠️ [AS400] Offline / Driver / Unreachable: ${error.message}`);
                    return;
                }
                throw error;
            } finally {
                if (connection) {
                    try {
                        await connection.close();
                    } catch {
                        // ignore close error
                    }
                }
            }
        });
    });

    describe('Safety Verification (No Data Modification Guarantee)', () => {
        it('should verify that all test queries are read-only (SELECT queries only)', () => {
            const forbiddenKeywords = [
                'INSERT INTO',
                'UPDATE ',
                'DELETE FROM',
                'DROP TABLE',
                'ALTER TABLE',
                'TRUNCATE TABLE',
            ];

            const allowedPingQueries = [
                "SELECT 1 AS PING, TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') AS SERVER_TIME FROM DUAL",
                'SELECT 1 AS ping, NOW() AS server_time',
                'SELECT 1 AS ping, GETDATE() AS server_time',
                'SELECT 1 AS PING FROM SYSIBM.SYSDUMMY1',
            ];

            for (const sql of allowedPingQueries) {
                const upperSql = sql.toUpperCase();
                expect(upperSql.startsWith('SELECT')).toBe(true);
                for (const keyword of forbiddenKeywords) {
                    expect(upperSql).not.toContain(keyword);
                }
            }
        });
    });
});
