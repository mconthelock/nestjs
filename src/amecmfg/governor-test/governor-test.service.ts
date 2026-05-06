import * as sql from 'mssql';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { MachineRepository } from 'src/escs/machine/machine.repository';
import { GetGovernorTestDto } from './dto/get-governor-test.dto';
import { GovernorTestResponseDto } from './dto/governor-test-response.dto';

type TestType = 'CAR' | 'CE' | 'CWT';

@Injectable()
export class GovernorTestService {
    constructor(private readonly machineRepo: MachineRepository) {}

    async getCAR(dto: GetGovernorTestDto): Promise<GovernorTestResponseDto> {
        return this.query(dto, 'CAR');
    }

    async getCE(dto: GetGovernorTestDto): Promise<GovernorTestResponseDto> {
        return this.query(dto, 'CE');
    }

    async getCWT(dto: GetGovernorTestDto): Promise<GovernorTestResponseDto> {
        return this.query(dto, 'CWT');
    }

    private async query(dto: GetGovernorTestDto, type: TestType): Promise<GovernorTestResponseDto> {
        let pool: sql.ConnectionPool | null = null;

        try {
            const machine = await this.machineRepo.findByName(dto.machineName);
            if (!machine) {
                throw new NotFoundException('Machine not found');
            }

            const config = this.parseConnectionString(machine.MC_DATASOURCE);
            pool = await new sql.ConnectionPool(config).connect();
            const result = await pool
                .request()
                .input('order', sql.VarChar, dto.order)
                .query(`
                    SELECT DISTINCT TOP 3 *
                    FROM tblInspectionRecord
                    WHERE [Order] = @order
                      AND ${this.getCondition(type)}
                    ORDER BY timeStamp DESC
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
                data: result.recordset.map((r) => ({
                    timeStamp: String(r.timeStamp),
                    date: r.dDate,
                    time: r.tTime,
                    order: r.Order,
                    testId: String(r.testid),
                    os: String(r.Os),
                    tr: String(r.Tr),
                    result: r.Results,
                    en: r.En,
                })),
            };
        } catch (err) {
            if (err instanceof NotFoundException) throw err;

            throw new InternalServerErrorException({
                message: 'GOVERNOR_TEST failed',
                error: err?.message,
            });
        } finally {
            if (pool) {
                try {
                    await pool.close();
                } catch (_) {}
            }
        }
    }

    private getCondition(type: TestType): string {
        switch (type) {
            case 'CAR':
                return 'Os != 0 AND Tr != 0';
            case 'CE':
                return 'Os != 0 AND Tr = 0';
            case 'CWT':
                return 'Os = 0 AND Tr != 0';
            default:
                throw new Error(`Invalid test type: ${type}`);
        }
    }

    private parseConnectionString(str: string): sql.config {
        const parts = Object.fromEntries(
            str.split(';')
                .filter(Boolean)
                .map((p) => {
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