import { Injectable, OnModuleInit } from '@nestjs/common';
import * as odbc from 'odbc';

@Injectable()
export class ConectionService {
    private connection: odbc.Connection;
    private isConnecting = false;
    private readonly connectionConfig =
        'DRIVER={iSeries Access ODBC Driver};SYSTEM=AMEC400;UID=OGGUSER;PWD=OGGUSER';

    async onModuleInit() {
        await this.connect();
    }

    async onModuleDestroy() {
        await this.close();
    }

    private async connect(): Promise<void> {
        if (this.isConnecting) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            return;
        }

        try {
            this.isConnecting = true;
            this.connection = await odbc.connect(this.connectionConfig);
            console.log('✅ Connected to IBM AS400');
        } catch (error) {
            console.error('❌ Connection failed:', error);
            this.connection = null;
            throw error;
        } finally {
            this.isConnecting = false;
        }
    }

    private async ensureConnection(): Promise<void> {
        if (!this.connection) {
            console.log('🔄 No connection, attempting to connect...');
            await this.connect();
            return;
        }

        // ทดสอบ connection อย่างง่าย
        try {
            await this.connection.query('SELECT 1 FROM SYSIBM.SYSDUMMY1');
        } catch (error) {
            console.log('🔄 Connection test failed, reconnecting...');
            this.connection = null;
            await this.connect();
        }
    }

    async runQuery(sql: string): Promise<any[]> {
        const maxRetries = 2;
        let lastError: any;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await this.ensureConnection();
                const result = await this.connection.query(sql);
                return result;
            } catch (err) {
                lastError = err;

                // Log error details เพื่อ debug
                console.error(
                    `❌ Query error (attempt ${attempt}/${maxRetries}):`,
                    {
                        message: err?.message,
                        name: err?.name,
                        stack: err?.stack,
                        odbcErrors: err?.odbcErrors,
                        allKeys: Object.keys(err || {}),
                    },
                );

                // ลอง reconnect ทุกครั้งที่ query error และยังมี retry เหลือ
                if (attempt < maxRetries) {
                    console.log(
                        `🔄 Reconnecting and retrying (${attempt + 1}/${maxRetries})...`,
                    );
                    this.connection = null;
                    await new Promise((resolve) => setTimeout(resolve, 1000)); // รอ 1 วินาที
                    continue;
                }

                break;
            }
        }

        throw lastError;
    }

    async close() {
        if (this.connection) {
            try {
                await this.connection.close();
                console.log('🔌 Connection closed');
            } catch (error) {
                console.log('⚠️ Error closing connection:', error?.message);
            } finally {
                this.connection = null;
            }
        }
    }

    async reconnect(): Promise<void> {
        await this.close();
        await this.connect();
    }

    isConnected(): boolean {
        return this.connection !== null && !this.isConnecting;
    }
}
