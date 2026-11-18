import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthcheckService implements OnModuleInit {
    constructor(
        @InjectDataSource('mitsuConnection')
        private readonly mitsuDs: DataSource,
    ) {}

    async checkMitsu(): Promise<{ status: string; message?: string }> {
        try {
            await this.mitsuDs.query(
                `SELECT 'MITSU', TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') FROM DUAL`,
            );
            return { status: 'ok' };
        } catch (error) {
            console.log(`Error: ${error.message}`);
            return { status: 'error', message: error.message };
        }
    }

    onModuleInit() {
        setInterval(() => {
            if (process.env.HOST == 'AMEC') {
                console.log('Running check connection.');
                this.checkMitsu();
            }
        }, 600_000);
    }
}
