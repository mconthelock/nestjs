import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

const RAW_ALLOW_ORIGINS = (process.env.ALLOW_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// helper: เช็ค wildcard โดเมน (*.mitsubishielevatorasia.co.th) + localhost
function isAllowedOrigin(origin?: string) {
  if (!origin) return true; // รองรับกรณีไม่มี Origin (curl/healthcheck)
  try {
    const u = new URL(origin);
    const host = u.hostname.toLowerCase();

    // allowlist ตรง ๆ จาก env
    if (RAW_ALLOW_ORIGINS.includes(origin)) return true;

    // อนุญาตโดเมนหลักและซับโดเมนขององค์กร
    if (
      host === 'mitsubishielevatorasia.co.th' ||
      host.endsWith('.mitsubishielevatorasia.co.th')
    ) return true;

    // localhost/dev
    if (host === 'localhost' || host === '127.0.0.1') return true;

    return false;
  } catch {
    return false;
  }
}

export class SocketIoAdapter extends IoAdapter {
  constructor(app: INestApplicationContext) {
    super(app);
  }

  override createIOServer(port: number, options?: ServerOptions) {
    const opt: ServerOptions = {
      // ตั้งค่า default ให้ทุก gateway
      path: '/socket.io',
      transports: ['websocket'], // ลดปัญหา preflight/polling
      cors: {
        origin: (origin, cb) => {
          if (isAllowedOrigin(origin)) return cb(null, true);
          return cb(new Error('WS CORS blocked'), false);
        },
        credentials: true,
        methods: ['GET', 'POST'],
      },
      ...options, // ถ้า gateway ไหนมี option เฉพาะ จะ override ตรงนี้
    };

    const server = super.createIOServer(port, opt);
    return server;
  }
}
