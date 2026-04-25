import { DataSource, QueryRunner } from 'typeorm';
import * as oracledb from 'oracledb';

/**
 * Oracle Base Repository
 * @author Mr.Pathanapong Sokpukeaw
 * @since 2026-04-25
 */
export class OracleRepository {
    constructor(protected readonly ds: DataSource) {}

    /**
     * Create query runner safely
     * @returns {Promise<QueryRunner>}
     */
    private async createRunner(): Promise<QueryRunner> {
        const runner = this.ds.createQueryRunner();
        await runner.connect();
        return runner;
    }

    /**
     * Execute Oracle procedure with REF CURSOR
     * @author Mr.Pathanapong Sokpukeaw
     * @since 2026-04-25
     * @param {string} procName Oracle procedure name
     * @param {Record<string, any>} params Input parameters
     * @param {string[]} bindOrder Parameter order for binding
     * @returns {Promise<any[]>}
     */
    protected async execCursor(
        procName: string,
        params: Record<string, any>,
        bindOrder: string[]
    ) {
        const runner = await this.createRunner();

        try {
            // Use native Oracle connection (required for REF CURSOR)
            const connection: any = (runner as any).databaseConnection;

            const bindParams: Record<string, any> = {};

            // Map input parameters based on defined order
            bindOrder.forEach((key) => {
                bindParams[key] = params[key];
            });

            // Define OUT cursor parameter
            bindParams.RESULT = {
                dir: oracledb.BIND_OUT,
                type: oracledb.CURSOR
            };

            const sql = `
                BEGIN ${procName}(
                    ${bindOrder.map((p) => `:${p}`).join(', ')},
                    :RESULT
                ); END;
            `;

            const result = await connection.execute(sql, bindParams);
            const cursor = result.outBinds.RESULT;
            const rows   = await cursor.getRows();

            await cursor.close();

            return rows;
        } finally {
            // Always release query runner
            await runner.release();
        }
    }

    /**
     * Execute Oracle procedure (no cursor)
     * @author Mr.Pathanapong Sokpukeaw
     * @since 2026-04-25
     * @param {string} procName Oracle procedure name
     * @param {Record<string, any>} params Input parameters
     * @param {string[]} bindOrder Parameter order for binding
     * @returns {Promise<void>}
     */
    protected async execProcedure(
        procName: string,
        params: Record<string, any>,
        bindOrder: string[]
    ) {
        const runner = await this.createRunner();

        try {
            // Use native Oracle connection (required for procedure execution)
            const connection: any = (runner as any).databaseConnection;

            const bindParams: Record<string, any> = {};

            // Map input parameters based on defined order
            bindOrder.forEach((key) => {
                bindParams[key] = params[key];
            });

            const sql = `
                BEGIN ${procName}(
                    ${bindOrder.map((k) => `:${k}`).join(', ')}
                ); END;
            `;

            // Execute stored procedure
            const result = await connection.execute(sql, bindParams);

            // Commit only if autoCommit is disabled
            if (result?.outBinds === undefined && connection?.commit) {
                await connection.commit();
            }
        } finally {
            // Always release query runner
            await runner.release();
        }
    }
}