import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SYS_FOLDER_PATH } from 'src/common/Entities/escs/table/SYS_FOLDER_PATH.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { LoadLessTestResponseDto } from './dto/load-less-test-result.dto';

@Injectable()
export class LoadLessTestService {
    constructor(
        @InjectRepository(SYS_FOLDER_PATH, 'escsConnection')
        private readonly db: Repository<SYS_FOLDER_PATH>,
    ) {}

    /**
     * Get load less test result from CSV file by machine and serial number
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2026-04-21
     * @param   {string} serial Serial number
     * @param   {string} order Order number
     * @return  {Promise<LoadLessTestResponseDto | null>}
     */
    async getLoadLessTestResult(serial: string, order: string): Promise<LoadLessTestResponseDto | null> {
        const basePath = await this.getPath('TSTM-001');
        const now   = new Date();
        const year  = now.getFullYear();
        const month = now.getMonth() + 1;
        const day   = now.getDate();
        const folderPath = path.join(
            basePath,
            `Year ${year}`,
            this.formatMonth(month, year),
            'Load less'
        );

        const fileName = `${year}_${this.pad(month)}${this.pad(day)}.csv`;
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
            const cols   = line.split(',');
            const header = cols[0]?.trim();
            const parts  = header.split('|');

            if (parts.length < 3) continue;

            const serialCol = parts[1]?.trim();
            const orderCol  = parts[2]?.trim();
            const statusCol = cols[cols.length - 1]?.trim(); 
            if ( serialCol === serial && orderCol === order && statusCol === 'OK') {
                return {
                    status: 'OK',
                    data: {
                        inducedVoltageConstant: cols[9]
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

    private pad(num: number): string {
        return num.toString().padStart(2, '0');
    }

    private formatMonth(month: number, year: number): string {
        const yy = year.toString().slice(-2);
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        return `${this.pad(month)}.${months[month - 1]} ${yy}`;
    }
}