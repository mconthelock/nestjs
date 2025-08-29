// src/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config(); // โหลดค่าจากไฟล์ .env

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.HOME_HOST,
  port: parseInt(process.env.HOME_PORT as string, 10),
  username: process.env.HOME_USER,
  password: process.env.HOME_PASSWORD,
  database: process.env.HOME_DATABASE,
  entities: [
    __dirname + '/../../**/**/*.entity{.ts,.js}',
    __dirname + '/../../**/**/**/*.entity{.ts,.js}',
  ],
  migrations: [__dirname + '/migrations/**/*.{js,ts}'],
});
