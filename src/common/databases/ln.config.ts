import * as dotenv from 'dotenv';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TypeOrmWinstonLogger } from '../logger/typeorm-winston.logger';
dotenv.config();

let lnConfig: TypeOrmModuleAsyncOptions;
if (process.env.HOST == 'AMEC') {
    lnConfig = {
        name: 'lnConnection',
        imports: [],
        inject: [ConfigService, WINSTON_MODULE_PROVIDER],
        useFactory: async (config: ConfigService, winstonLogger: Logger) => ({
            type: 'mssql',
            host: process.env.LN_HOST,
            port: Number(process.env.LN_PORT) || 1433,
            username: process.env.LN_USER,
            password: process.env.LN_PASSWORD,
            database: process.env.LN_DATABASE || process.env.LN_SERVICE,
            autoLoadEntities: true,
            synchronize: false,
            logger: new TypeOrmWinstonLogger(winstonLogger),
            retryAttempts: 5,
            retryDelay: 2000,
            options: {
                instanceName: process.env.LN_INSTANCE, // ใช้ instanceName แทนถ้าเป็น SQL Server ที่มี instance
                encrypt: false,
                enableArithAbort: true,
                trustServerCertificate: true,
            },
            extra: {
                // connection pool options for mssql (tedious)
                pool: {
                    max: 100,
                    min: 5,
                    // idleTimeoutMillis is a common pool option; adjust as needed
                    idleTimeoutMillis: 30000,
                },
                // request timeout in ms
                requestTimeout: 60000,
            },
        }),
    };
} else {
    lnConfig = {
        name: 'lnConnection',
        imports: [],
        inject: [ConfigService],
        useFactory: async (config: ConfigService) => ({
            type: 'mysql',
            host: process.env.HOME_HOST,
            port: parseInt(process.env.HOME_PORT as string, 10),
            username: process.env.HOME_USER,
            password: process.env.HOME_PASSWORD,
            database: process.env.AUD_DATABASE,
            entities: [
                __dirname + '/../../**/**/*.entity{.ts,.js}',
                __dirname + '/../../**/**/**/*.entity{.ts,.js}',
            ],
            synchronize: false,
        }),
    };
}

export default lnConfig;
