import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TypeOrmWinstonLogger } from '../logger/typeorm-winston.logger';

dotenv.config();
let mitsuConfig: TypeOrmModuleAsyncOptions;
if (process.env.HOST == 'AMEC') {
    mitsuConfig = {
        name: 'mitsuConnection',
        imports: [],
        inject: [ConfigService, WINSTON_MODULE_PROVIDER],
        useFactory: async (config: ConfigService, winstonLogger: Logger) => ({
            type: 'oracle',
            username: process.env.MITSU_USER,
            password: process.env.MITSU_PASSWORD,
            schema: process.env.MITSU_SCHEMA,
            connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.MITSU_HOST})(PORT=${process.env.MITSU_PORT}))(CONNECT_DATA=(SID=${process.env.MITSU_SERVICE})))`,
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
    mitsuConfig = {
        name: 'mitsuConnection',
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
            autoLoadEntities: true,
            synchronize: false,
            logger: new TypeOrmWinstonLogger(winstonLogger),
        }),
    };
}
export default mitsuConfig;
