import * as sql from 'mssql';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { MachineRepository } from 'src/escs/machine/machine.repository';
import { GetPullTestDto } from './dto/get-pull-test.dto';
import { PullTestResponseDto } from './dto/pull-test-response.dto';

@Injectable()
export class PullTestService {
    constructor(private readonly machineRepo: MachineRepository) {}

    async getPullTest(dto: GetPullTestDto): Promise<PullTestResponseDto> {
        let pool: sql.ConnectionPool | null = null;

        try {
            const machine = await this.machineRepo.findByName(dto.machineName);
            if (!machine) throw new NotFoundException('Machine not found');

            const config = this.parseConnectionString(machine.MC_DATASOURCE);
            pool = await new sql.ConnectionPool(config).connect();
            const result = await pool
                .request()
                .input('order', sql.VarChar, dto.order)
                .input('typeModel', sql.VarChar, dto.typeModel)
                .query(`
                    SELECT TOP 3 
                        A.ORDERNO,
                        B.RepeatNo,
                        B.PullValue,
                        B.Result,
                        B.Tester,
                        B.SpringLength
                    FROM ProdSelect A
                    JOIN ResultHeader B ON A.ID = B.ProdSelID
                    WHERE A.ORDERNO = @order
                      AND A.GOV_TYPE = @typeModel
                    ORDER BY B.RepeatNo DESC
                `);

            if (!result.recordset.length) {
                return {
                    status: 'ERROR',
                    message: 'ไม่พบข้อมูล Test ในระบบ กรุณาลองใหม่อีกครั้ง!',
                    data: null,
                };
            }

            return {
                status: 'SUCCESS',
                message: null,
                data: result.recordset.map(r => ({
                    orderNo: r.ORDERNO,
                    repeatNo: String(r.RepeatNo),
                    pullValue: String(r.PullValue),
                    result: r.Result,
                    tester: r.Tester,
                    springLength: String(r.SpringLength),
                })),
            };
        } catch (err) {
            if (err instanceof NotFoundException) throw err;

            throw new InternalServerErrorException({
                message: 'PULL_TEST failed',
                error: err?.message,
            });
        } finally {
            if (pool) {
                try { await pool.close(); } catch {}
            }
        }
    }

    private parseConnectionString(str: string): sql.config {
        const parts = Object.fromEntries(
            str.split(';')
                .filter(Boolean)
                .map(p => {
                    const [k, v] = p.split('=');
                    return [k.trim(), v];
                }),
        );
        const dataSource = parts['Data Source'] || '';
        const [server, instanceName] = dataSource.split('\\');

        return {
            server,
            database: parts['Initial Catalog'],
            user: parts['User ID'],
            password: parts['Password'],
            connectionTimeout: 5000, 
            requestTimeout: 5000,
            options: {
                instanceName, 
                encrypt: false,
                trustServerCertificate: true,
            },
            pool: {
                max: 5,
                min: 0,
                idleTimeoutMillis: 5000,
            },
        };
    }
}