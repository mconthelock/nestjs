import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SYS_FOLDER_PATH } from 'src/common/Entities/escs/table/SYS_FOLDER_PATH.entity';
import { LoadLessTestResponseDto } from './dto/load-less-test-result.dto';

@Injectable()
export class LoadLessTestService {
    constructor(
        @InjectRepository(SYS_FOLDER_PATH, 'escsConnection')
        private readonly db: Repository<SYS_FOLDER_PATH>,
    ) {}

    async getLoadLessTestResult(serial: string, order: string): Promise<LoadLessTestResponseDto | null> {
        serial = serial?.trim();
        order  = order?.trim();
        const basePath = await this.getPath('TSTM-001');

        // Check last 7 days for the test result
        for (let i = 0; i < 7; i++) {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() - i);

            const year  = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1;
            const day   = targetDate.getDate();
            const folderPath = path.join(
                basePath,
                `Year ${year}`,
                this.formatMonth(month, year),
                'Load less'
            );

            const fileName = `${year}_${this.pad(month)}${this.pad(day)}.csv`;
            const fullPath = path.join(folderPath, fileName);
            if (!fs.existsSync(fullPath)) {
                continue;
            }

            const content = fs.readFileSync(fullPath, 'utf-8');
            const lines   = content.split(/\r?\n/).reverse();
            for (const line of lines) {
                if (!line.trim()) continue;

                const cols   = line.split(',');
                const header = cols[0]?.trim();
                if (!header) continue;

                const parts = header.split(/\s*[|-]\s*/);
                if (parts.length < 3) continue;

                const serialCol = parts[1]?.trim();
                const orderCol  = parts[2]?.trim();
                const statusCol = cols[cols.length - 1]?.trim();
                if (serialCol === serial && orderCol === order &&statusCol === 'OK') {
                    return {
                        status: 'SUCCESS',
                        message: null,
                        data: {
                            suctionSoundDb: cols[5],
                            fallingSoundDb: cols[6],
                            runningSoundDb: cols[7],
                            housingTemp: cols[8],
                            inducedVoltageConstant: cols[9],
                        },
                    };
                }
            }
        }

        return {
            status: 'ERROR',
            message: 'ไม่พบข้อมูล Test ในระบบ กรุณาลองใหม่อีกครั้ง!',
            data: null,
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