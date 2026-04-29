import { DataSource, QueryRunner } from 'typeorm';
import * as oracledb from 'oracledb';
import { Connection, Result } from 'oracledb';

/**
 * Oracle Base Repository
 * @author Mr.Pathanapong Sokpukeaw
 * @since 2026-04-25
 */
export class OracleRepository {
    constructor(protected readonly ds: DataSource) {}

    /**
     * Create query runner safely
     */
    private async createRunner(): Promise<QueryRunner> {
        const runner = this.ds.createQueryRunner();
        await runner.connect();
        return runner;
    }

    /**
     * Get native Oracle connection
     */
    private getConnection(runner: QueryRunner): Connection {
        return (runner as any).databaseConnection as Connection;
    }

    /**
     * Validate & map bind params
     */
    private mapBindParams(
        params: Record<string, any>,
        bindOrder: string[]
    ): Record<string, any> {
        const bindParams: Record<string, any> = {};

        for (const key of bindOrder) {
            if (!(key in params)) {
                throw new Error(`Missing param: ${key}`);
            }
            bindParams[key] = params[key];
        }

        return bindParams;
    }

    /**
     * Execute Oracle procedure with REF CURSOR
     */
    protected async execCursor(
        procName: string,
        params: Record<string, any>,
        bindOrder: string[]
    ) {
        const runner = await this.createRunner();
        const connection = this.getConnection(runner);

        try {
            const bindParams = this.mapBindParams(params, bindOrder);

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

            const result = await connection.execute(sql, bindParams, { outFormat: oracledb.OUT_FORMAT_OBJECT });
            const cursor = result.outBinds.RESULT;
            const rows   = await cursor.getRows();

            await cursor.close();

            return rows;
        } catch (error) {
            throw error;
        } finally {
            // Always release query runner
            await runner.release();
        }
    }

    /**
     * Execute Oracle procedure (no cursor)
     */
    protected async execProcedure(
        procName: string,
        params: Record<string, any>,
        bindOrder: string[]
    ) {
        const runner = await this.createRunner();
        const connection = this.getConnection(runner);

        try {
            const bindParams = this.mapBindParams(params, bindOrder);

            const sql = `
                BEGIN ${procName}(
                    ${bindOrder.map((k) => `:${k}`).join(', ')}
                ); END;
            `;

            // Execute stored procedure
            await connection.execute(sql, bindParams);
            await connection.commit();
        } catch (error) {
            try {
                await connection.rollback();
            } catch (_) {}
            
            throw error;
        } finally {
            // Always release query runner
            await runner.release();
        }
    }

    /**
     * Execute raw SQL query
     */
    protected async query(sql: string, params?: any) {
        return this.ds.query(sql, params);
    }
}