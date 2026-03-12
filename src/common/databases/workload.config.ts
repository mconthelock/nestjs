import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TypeOrmWinstonLogger } from '../logger/typeorm-winston.logger';

dotenv.config();
let workloadConfig: TypeOrmModuleAsyncOptions;
if (process.env.HOST == 'AMEC') {
    workloadConfig = {
        name: 'workloadConnection',
        imports: [],
        inject: [ConfigService, WINSTON_MODULE_PROVIDER],
        useFactory: async (config: ConfigService, winstonLogger: Logger) => ({
            // inject: [ConfigService],
            // useFactory: async (config: ConfigService) => ({
            type: 'oracle',
            username: process.env.WORKLOAD_USER,
            password: process.env.WORKLOAD_PASSWORD,
            schema: process.env.WORKLOAD_SCHEMA,
            connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.WORKLOAD_HOST})(PORT=${process.env.WORKLOAD_PORT}))(CONNECT_DATA=(SID=${process.env.WORKLOAD_SERVICE})))`,
            entities: [
                __dirname + '/../Entities/workload/**/*.entity{.ts,.js}',
            ],
            autoLoadEntities: true,
            synchronize: false,
            logger: new TypeOrmWinstonLogger(winstonLogger),
            retryAttempts: 5,
            retryDelay: 2000,
            extra: {
                keepAlive: true,
                poolMax: +process.env.DB_POOL_MAX || 10,
                poolMin: +process.env.DB_POOL_MIN || 1,
                queueTimeout: 60000,
                queueMax: 1000,
                enableTCPSKeepAlive: true,
                poolIncrement: 1,
                poolTimeout: 300,
                poolPingInterval: 60,
                stmtCacheSize: 50,
            },
        }),
    };
} else {
    workloadConfig = {
        name: 'workloadConnection',
        imports: [],
        inject: [ConfigService, WINSTON_MODULE_PROVIDER],
        useFactory: async (config: ConfigService, winstonLogger: Logger) => ({
            type: 'mysql',
            host: process.env.HOME_HOST,
            port: parseInt(process.env.HOME_PORT as string, 10),
            username: process.env.HOME_USER,
            password: process.env.HOME_PASSWORD,
            database: process.env.HOME_DATABASE,
            entities: [
                __dirname + '/../Entities/workload/**/*.entity{.ts,.js}',
            ],
            synchronize: false,
            logger: new TypeOrmWinstonLogger(winstonLogger),
        }),
    };
}
export default workloadConfig;
