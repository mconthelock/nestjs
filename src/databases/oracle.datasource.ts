import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TypeOrmWinstonLogger } from 'src/common/logger/typeorm-winston.logger';
let dataSource: DataSource;

export async function getOracleDataSource(): Promise<DataSource> {
  if (!dataSource || !dataSource.isInitialized) {
    const winstonLogger = new Logger();
    dataSource = new DataSource({
      type: 'oracle',
      username: process.env.AMEC_USER,
      password: process.env.AMEC_PASSWORD,
      connectString: `${process.env.AMEC_HOST}:${process.env.AMEC_PORT}/${process.env.AMEC_SERVICE}?expire_time=5`,
      entities: [
        __dirname + '/../**/**/*.entity{.ts,.js}',
        __dirname + '/../**/**/**/*.entity{.ts,.js}',
      ],
      synchronize: false,
      logging: ['error'],
      logger: new TypeOrmWinstonLogger(winstonLogger),
      extra: {
        poolMax: 100,
        poolMin: 5,
        queueTimeout: 60000,
        queueMax: 1000,
        enableTCPSKeepAlive: true,
        poolIncrement: 1,
        poolTimeout: 300,
        poolPingInterval: 60,
        stmtCacheSize: 50,
      },
    });
    await dataSource.initialize();
    console.log('[Oracle] DataSource initialized');
  }
  return dataSource;
}

export async function reconnectOracleDataSource() {
  try {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('[Oracle] Old DataSource destroyed');
    }
  } catch (err) {
    console.warn('[Oracle] Error destroying DataSource:', err.message);
  }
  dataSource = undefined;
  return getOracleDataSource();
}
