import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { StaticTestResultDto } from './dto/static-test-result.dto';

@Injectable()
export class StaticTestService {

    private basePath = '\\\\amecnas\\amecweb\\wwwroot\\temp\\DX';

    /**
     * Get static test result from CSV file by machine and serial number
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2026-04-20
     * @param   {string} machine Machine code (e.g. 01, 02)
     * @param   {string} serial Serial number
     * @return  {Promise<StaticTestResultDto | null>}
     */
    async getStaticTestResult(machine: string, serial: string): Promise<StaticTestResultDto | null> {
        const year = 2026;
        const month = 4;

        const folderPath = path.join(
            this.basePath,
            `Year ${year}`,
            this.formatMonth(month, year),
            'Static no.1,2'
        );

        const fileName = `(Static${machine})_${year}${this.pad(month)}.csv`;
        const fullPath = path.join(folderPath, fileName);

        if (!fs.existsSync(fullPath)) {
            throw new Error(`File not found: ${fullPath}`);
        }

        const fileStream = fs.createReadStream(fullPath);

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        for await (const line of rl) {
            const cols = line.split(',');

            const serialCol = cols[4]?.trim();
            const status = cols[cols.length - 2]?.trim();

            if (serialCol === serial && status === 'OK') {
                return {
                    resistanceMotorU: cols[15],
                    resistanceMotorV: cols[20],
                    resistanceMotorW: cols[25],
                    resistanceBrakeL: cols[60],
                    resistanceBrakeR: cols[55],
                };
            }
        }

        return null;
    }

    private pad(month: number): string {
        return month.toString().padStart(2, '0');
    }

    private formatMonth(month: number, year: number): string {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const yy = year.toString().slice(-2);
        return `${this.pad(month)}.${months[month - 1]} ${yy}`;
    }
}