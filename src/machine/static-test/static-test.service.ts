import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SYS_FOLDER_PATH } from 'src/common/Entities/escs/table/SYS_FOLDER_PATH.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { StaticTestResponseDto } from './dto/static-test-result.dto';

@Injectable()
export class StaticTestService {
    constructor(
        @InjectRepository(SYS_FOLDER_PATH, 'escsConnection')
        private readonly db: Repository<SYS_FOLDER_PATH>,
    ) {}

    /**
     * Get static test result from CSV file by machine and serial number
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2026-04-20
     * @param   {string} machine Machine code (e.g. 01, 02)
     * @param   {string} serial Serial number
     * @return  {Promise<StaticTestResponseDto | null>}
     */
    async getStaticTestResult(machine: string, serial: string): Promise<StaticTestResponseDto | null> {
        const basePath  = await this.getPath('TSTM-001');
        const machineNo = this.formatMachine(machine);
        const now   = new Date();
        const year  = now.getFullYear();
        const month = now.getMonth() + 1;
        const folderPath = path.join(
            basePath,
            `Year ${year}`,
            this.formatMonth(month, year),
            'Static no.1,2'
        );

        const fileName = `(Static${machineNo})_${year}${this.pad(month)}.csv`;
        const fullPath = path.join(folderPath, fileName);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`File not found: ${fullPath}`);
        }

        const fileStream = fs.createReadStream(fullPath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            const cols = line.split(',');
            const serialCol = cols[4]?.trim();
            const statusCol = cols[cols.length - 2]?.trim();
            if (serialCol === serial && statusCol === 'OK') {
                return {
                    status: 'OK',
                    data: {
                        resistanceMotorU: cols[15],
                        resistanceMotorV: cols[20],
                        resistanceMotorW: cols[25],
                        resistanceBrakeL: cols[55],
                        resistanceBrakeR: cols[40]
                    }
                };
            }
        }

        return {
            status: 'NO_DATA',
            data: null
        };
    }

    private async getPath(fdpId: string): Promise<string> {
        const data = await this.db.findOne({
            where: { FDP_ID: fdpId }
        });

        if (!data) {
            throw new Error(`Base path not found for FDP_ID: ${fdpId}`);
        }

        return data.FDP_DESCRIPTION;
    }

    private pad(month: number): string {
        return month.toString().padStart(2, '0');
    }

    private formatMonth(month: number, year: number): string {
        const yy = year.toString().slice(-2);
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        return `${this.pad(month)}.${months[month - 1]} ${yy}`;
    }

    private formatMachine(machine: string): string {
        return machine.toString().padStart(2, '0');
    }
}