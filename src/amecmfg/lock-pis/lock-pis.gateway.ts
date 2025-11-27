import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayConnection,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
// import { LockPisService } from './lock-pis.service';
import { Socket, Server } from 'socket.io';
import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS, REDIS_SUB } from '../../common/redis/redis.provider';
import { UsersService } from '../../amec/users/users.service';
import * as crypto from 'crypto';

//prettier-ignore
@WebSocketGateway({ namespace: '/lockpis' })
@Injectable()
export class LockPisGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger('LockPisGateway');

  constructor(
    @Inject(REDIS) private readonly redis: Redis,
    @Inject(REDIS_SUB) private readonly redisSub: Redis,
    private readonly usersService: UsersService,
  ) {
    // subscribe to expired events (DB 0)
    // channel name is "__keyevent@0__:expired" when notify-keyspace-events is set to Ex
    this.redisSub.subscribe('__keyevent@0__:expired', (err) => {
      if (err) this.logger.error('subscribe failed', err);
      else this.logger.debug('Subscribed to __keyevent@0__:expired');
    });

    this.redisSub.on('message', async (_chan, message) => {
      
      // message is key name that expired
      try {
        // กันไม่ให้ หลาย instance ประมวลผลพร้อมกัน
        // สร้าง key สั้นๆ ปลอดภัย (hash) เพื่อใช้เป็น lock-per-message
        const hash = crypto.createHash('sha1').update(message).digest('hex');
        const lockKey = `procLock:${hash}`;

        // เลือก TTL ให้พอประมวลผล แล้วก็ short (ms)
        const lockTtlMs = 2000; // 2 วินาที (ปรับตามเวลาประมวลผลจริง)
        const got = await this.redis.set(lockKey, `${process.pid}`, 'PX', lockTtlMs, 'NX');
        if (!got) {
          // instance อื่นได้สิทธิ์ประมวลผลแล้ว -> ข้าม
          // this.logger.debug(`[pid=${process.pid}] skip processing (locked by other):`, message);
          return;
        }
        this.logger.debug('expired:', message);
        
        if (message.startsWith('lock:')) {
          const payload = message.replace(/^lock:/, ''); // ลบ prefix ออก
          const [itemId, order] = payload.split('::');   // แยก itemId กับ order
          //  แจ้งเตือนทุก client ว่า lock หมดอายุแล้ว
          this.server.emit('lock_expired', { itemId, order });
        } else if (message.startsWith('warn:')) {
          const payload = message.replace(/^warn:/, '');        // ลบ prefix ออก
          const [empno, itemId, order] = payload.split('::');  // แยก userId, itemId กับ order
          // ส่งเตือนเฉพาะ client ว่า lock กำลังจะหมดอายุ
          const sockets = await this.redis.smembers(`userSockets:${empno}`); // ดึง socket id ของ user นี้
          for (const sid of sockets) {
            this.server.to(sid).emit('will_expire', {
              itemId: itemId,
              order: order,
            });
          }
        }

        try {
          await this.redis.del(lockKey); // ลบ lock หลังประมวลผลเสร็จ
        } catch (e) {
          this.logger.warn(`[pid=${process.pid}] failed to del lock ${lockKey}`, e?.message || e);
        }
      } catch (e) {
        this.logger.error('error handling expired message', e);
      }
    });
  }

  handleConnection(client: Socket) {
    // ถ้าไม่มี empno ใน query string ให้ตัดการเชื่อมต่อ
    const empno = client.handshake.query.empno as string;
    if (!empno) {
      client.disconnect(true);
      return;
    }
    const sid = client.id;
    client.data.empno = empno; // เก็บ empno ไว้ใน client object
    
    // เก็บ socket id ว่าใช้โดยใคร (expire เผื่อกรณี client หายไปเฉยๆ)
    this.redis.set(`socket:${sid}`, empno, 'EX', 60 * 60 * 24); // ตัวอย่าง expire 1 วัน
    // เก็บชุด socket id ของ user นี้
    this.redis.sadd(`userSockets:${empno}`, sid);

    this.logger.debug(`CONNECT ${empno} (${sid})`);
  }

  async handleDisconnect(client: Socket) {
    const sid = client.id;
    const empno = client.data.empno;
    const basket = await this.redis.smembers(`locks:${sid}`);
    this.logger.debug('socket', sid, 'basket', basket);
    for (const lock of basket) {
      this.redis.del(lock);
    }
    // ลบ socket id ออกจาก empno
    this.redis.srem(`userSockets:${empno}`, sid);
    // ลบ mapping socket id
    this.redis.del(`socket:${sid}`);
    this.logger.debug(`DISCONNECT ${sid}`);
  }

  @SubscribeMessage('logout')
  async handleLogout(@ConnectedSocket() client: Socket) {
    try {
      const empno = client.data.empno; // ดึง empno จาก client
      const userSockets = await this.redis.smembers(`userSockets:${empno}`);

      // ตัดการเชื่อมต่อทุก socket ของ user คนนี้
      this.server.in(userSockets).disconnectSockets(true);

      this.logger.debug('userSockets', userSockets);
      for (const sid of userSockets) {
        this.redis.del(`socket:${sid}`);
        const basket = await this.redis.smembers(`locks:${sid}`);
        this.logger.debug('socket', sid, 'basket', basket);
        for (const lock of basket) {
          this.redis.del(lock);
        }
      }
      this.redis.del(`userSockets:${empno}`);

      this.logger.debug('user socket', this.redis.get(`userSockets:${empno}`));

    } catch (e) {
      this.logger.error(e);
    }
  }

  @SubscribeMessage('lock_item')
  async handleLockItem(
    @MessageBody() data: { itemId: string; order: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const sid = client.id;
      const empno = client.data.empno;
      const { itemId, order } = data;
      const expire = 30 * 60 * 1000; // 30 minutes
      // const expire = 10 * 1000; // 10 seconds for testing
      const lock = `lock:${itemId}::${order}`;
      const setLock = await this.redis.set(lock, sid, 'PX', expire, 'NX');
      this.logger.debug(`lock', ${setLock}`);
      // เมื่อ lock สำเร็จ จะได้ 'OK'
      if (setLock === 'OK') {
        this.logger.debug('lock true');
        // สร้าง key เตือนล่วงหน้า
        const notify = expire - 30 * 1000; // 30 วินาที
        // const notify = expire - 5 * 1000; // 5 วินาที test
        const warn = `warn:${empno}::${itemId}::${order}`;
        this.logger.debug('warn', warn);
        const setWarn = await this.redis.set(warn, sid, 'PX', notify);
        this.logger.debug('set warn', setWarn);

        // เก็บไว้ใน set ว่าผู้ใช้คนนี้ล็อกอะไรไว้บ้าง
        const basket = await this.redis.sadd(`locks:${sid}`, lock);
        this.logger.debug(await this.redis.smembers(`locks:${sid}`));

        // แจ้ง client ว่าล็อกสำเร็จ
        client.emit('lock_status', { itemId, order, status: true });
      } else {
        this.logger.debug('lock false');

        // ล็อกไม่สำเร็จ แจ้งว่าใครเป็นเจ้าของ
        // ดึงค่า sid จาก lock คือ value
        const ownerSid = await this.redis.get(lock);
        // ดึง empno ของเจ้าของจาก sid
        const ownerEmp = await this.redis.get(`socket:${ownerSid}`);
        this.logger.debug(
          `lock_item failed: ${itemId}::${order} by ${empno}, owned by ${ownerEmp}`,
        );
        client.emit('lock_status', {
          itemId,
          order,
          status: false,
          owner: await this.usersService.findEmp(ownerEmp),
        });
      }
    } catch (e) {
      this.logger.error(e);
      client.emit('lock_status', {
        itemId: data.itemId,
        order: data.order,
        status: false,
        error: (e as Error).message,
      });
    }
  }

  @SubscribeMessage('unlock_item')
  async handleUnlockItem(
    @MessageBody() data: { itemId: string; order: string },
    @ConnectedSocket() client: Socket,
  ) {
    const sid = client.id;
    const lock = `lock:${data.itemId}::${data.order}`;
    // safe unlock (only owner)
    // ใช้ Lua script ในการตรวจสอบและลบแบบอะตอมมิก (atomic) ต้องเป็นเจ้าของเท่านั้นถึงลบได้
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    await this.redis.eval(script, 1, lock, sid);
    client.emit('unlock_status', {
      itemId: data.itemId,
      order: data.order,
      status: true,
    });
  }
}
