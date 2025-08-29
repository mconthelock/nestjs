// test-amec-connection.ts
import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
async function testConnection() {
  try {
    const conn = await createConnection({
      type: 'oracle',
      host: process.env.SP_HOST,
      port: Number(process.env.SP_PORT),
      username: process.env.SP_USER,
      password: process.env.SP_PASSWORD,
      sid: process.env.SP_SERVICE, // 👈 หรือ serviceName ขึ้นอยู่กับ DB
    });
    console.log('✅ Oracle connected successfully!');
    await conn.close();
  } catch (err) {
    console.error('❌ Connection failed:', err);
  }
}

testConnection();
