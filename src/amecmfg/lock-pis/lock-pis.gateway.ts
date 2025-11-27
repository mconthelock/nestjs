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

@WebSocketGateway({ namespace: '/lockpis' })
// export class LockPisGateway {
//   constructor(private readonly lockPisService: LockPisService) {}

//   @SubscribeMessage('createLockPi')
//   create(@MessageBody() createLockPiDto: CreateLockPiDto) {
//     return this.lockPisService.create(createLockPiDto);
//   }

//   @SubscribeMessage('findAllLockPis')
//   findAll() {
//     return this.lockPisService.findAll();
//   }

//   @SubscribeMessage('findOneLockPi')
//   findOne(@MessageBody() id: number) {
//     return this.lockPisService.findOne(id);
//   }

//   @SubscribeMessage('updateLockPi')
//   update(@MessageBody() updateLockPiDto: UpdateLockPiDto) {
//     return this.lockPisService.update(updateLockPiDto.id, updateLockPiDto);
//   }

//   @SubscribeMessage('removeLockPi')
//   remove(@MessageBody() id: number) {
//     return this.lockPisService.remove(id);
//   }
// }

// version 2
// @Injectable()
// export class LockPisGateway
//   implements OnGatewayConnection, OnGatewayDisconnect
// {
//   @WebSocketServer()
//   server: Server;

//   constructor(private readonly UsersService: UsersService) {}
//   private lockedItems = new Map<string, string>(); // itemId => socketId
//   private socketLocks = new Map<string, Set<string>>(); // socketId => Set<itemId>
//   private owner = new Map<string, Set<string>>(); // owner => socketId (เจ้าของไอเท็ม)
//   private logger = new Logger('LockPisGateway'); // เขียน log ด้วยชื่อ LockPis

//   //   onModuleInit() {
//   //     this.server.on('connection', (socket) => {
//   //       console.log('Client connected @ /lockpis:', socket.id);
//   //       console.log('Connected');
//   //     });
//   //     // this.server.emit('test', { message: 'PisGateway is ready' });
//   //   }

//   // เมื่อ connect เข้ามา
//   handleConnection(client: Socket) {
//     const empno = client.handshake.query.empno as string; // <-- จาก client
//     if (!empno) {
//       client.disconnect(true); // ถ้าไม่มี empno ให้ตัดการเชื่อมต่อ
//       return;
//     }

//     client.data.empno = empno; // เก็บ empno ใน data ของ client
//     this.logger.log(`CONNECT: ${empno} (${client.id})`);

//     if (!this.owner.has(empno)) this.owner.set(empno, new Set()); // สร้าง Set ใหม่ถ้า empno ยังไม่มี
//     this.owner.get(empno).add(client.id); // เก็บ client.id ใน Set ของ empno
//   }

//   // เมื่อ disconnect
//   handleDisconnect(client: Socket) {
//     const lockedByClient = this.socketLocks.get(client.id);
//     if (lockedByClient) {
//       for (const itemId of lockedByClient) {
//         this.lockedItems.delete(itemId);
//         this.logger.debug(`Auto-unlocked item: ${itemId}`);
//       }
//       this.socketLocks.delete(client.id);
//     }
//     this.logger.debug(`Client disconnected: ${client.id}`);

//     const empno = client.data.empno;
//     this.logger.log(`DISCONNECT: ${empno} (${client.id})`);

//     // ลบ socketId นี้ออกจาก owner
//     const sockets = this.owner.get(empno);
//     if (sockets) {
//       sockets.delete(client.id);
//       if (sockets.size === 0) {
//         this.owner.delete(empno);
//       }
//     }
//   }

//   @SubscribeMessage('lock_item')
//   async handleLockItem(
//     @MessageBody() data: { itemId: string; order: string },
//     @ConnectedSocket() client: Socket,
//   ) {
//     const { itemId, order } = data;

//     const key = `${itemId}::${order}`;

//     if (
//       this.lockedItems.has(key) && // ถ้าไอเท็มถูกล็อกอยู่แล้ว
//       this.lockedItems.get(key) !== client.id // ถ้าไอเท็มถูกล็อกโดยคนอื่น
//     ) {
//       client.emit('lock_status', {
//         itemId,
//         order,
//         status: false,
//         // owner: this.getOwnerByItem(key), // หาว่าใครเป็นเจ้าของไอเท็มนี้
//         user: await this.UsersService.findEmp(this.getOwnerByItem(key)),
//       });
//       return;
//     }

//     this.lockedItems.set(key, client.id); // เก็บว่าไอเท็มนี้ถูกล็อกโดย client.id

//     if (!this.socketLocks.has(client.id)) {
//       // ถ้า client.id ยังไม่มีใน socketLocks
//       this.socketLocks.set(client.id, new Set()); // สร้าง Set ใหม่
//     }
//     this.socketLocks.get(client.id).add(key); // เก็บ itemId ใน Set ของ client.id

//     client.emit('lock_status', {
//       itemId,
//       order,
//       status: true,
//       //   owner: client.data.empno,
//       user: await this.UsersService.findEmp(client.data.empno),
//     });
//   }

//   @SubscribeMessage('unlock_item')
//   handleUnlockItem(
//     @MessageBody() data: { itemId: string; order: string },
//     @ConnectedSocket() client: Socket,
//   ) {
//     const { itemId, order } = data;
//     const key = `${itemId}::${order}`;

//     if (this.lockedItems.get(key) === client.id) {
//       // ถ้าไอเท็มถูกล็อกโดย client.id
//       // ปลดล็อกไอเท็ม
//       this.lockedItems.delete(key); // ลบไอเท็มออกจาก lockedItems
//       this.socketLocks.get(client.id)?.delete(key); // ลบไอเท็มออกจาก Set ของ client.id
//       this.logger.debug(`Item unlocked: ${key}`);
//     }
//   }

//   @SubscribeMessage('logout')
//   handleLogout(@ConnectedSocket() client: Socket) {
//     const empno = client.data.empno; // ดึง empno จาก client
//     const sockets = this.owner.get(empno); // หาว่า empno นี้มี socketId อะไรบ้าง
//     if (sockets) {
//       for (const clientId of sockets) {
//         // ปลดล็อกไอเท็มที่ล็อกไว้ทั้งหมด
//         const items = this.socketLocks.get(clientId); // หาว่า clientId นี้ล็อกไอเท็มอะไรบ้าง
//         if (items) {
//           for (const itemId of items) {
//             this.lockedItems.delete(itemId); // ลบไอเท็มออกจาก lockedItems
//             this.logger.log(`AUTO-UNLOCK: ${itemId} by ${empno}`);
//           }
//           this.socketLocks.delete(clientId); // ลบ clientId ออกจาก socketLocks
//         }
//       }
//       this.owner.delete(empno); // ลบ empno ออกจาก owner
//     }

//     // ปิดการเชื่อมต่อ
//     client.disconnect(true);
//     this.logger.log(`LOGOUT: ${empno} (${client.id})`);
//   }

//   // ฟังก์ชันช่วยสำหรับหาว่าใครเป็นเจ้าของไอเท็ม
//   getOwnerByItem(item: string): string | undefined {
//     const socketId = this.lockedItems.get(item);
//     if (!socketId) return null;

//     for (const [empno, socketSet] of this.owner.entries()) {
//       if (socketSet.has(socketId)) {
//         return empno;
//       }
//     }
//     return null; // ไม่เจอ
//   }
// }

// version 3
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
      else this.logger.log('Subscribed to __keyevent@0__:expired');
    });

    this.redisSub.on('message', async (_chan, message) => {
      // message is key name that expired
      try {
        this.logger.log('expired:', message);
        if (message.startsWith('lock:')) {
          const payload = message.replace(/^lock:/, '');
          const [itemId, order] = payload.split('::');
          // emit to interested clients
          this.server.emit('lock_expired', { itemId, order });
        } else if (message.startsWith('warn:')) {
          // ถ้าทำ pre-warning key
          const payload = message.replace(/^warn:/, '');
          const [userId, itemId, order] = payload.split('::');
          // ส่งเตือนเฉพาะ user
          // ตัวอย่าง: ถ้าเก็บ mapping userSockets:<userId> => set(socketId)
          const sockets = await this.redis.smembers(`userSockets:${userId}`);
          for (const sid of sockets) {
            this.server.to(sid).emit('will_expire', {
              itemId: itemId,
              order: order
            });
          }
        }
      } catch (e) {
        this.logger.error('error handling expired message', e);
      }
    });
  }

  handleConnection(client: Socket) {
    const empno = client.handshake.query.empno as string;
    if (!empno) {
      client.disconnect(true);
      return;
    }
    const sid = client.id;
    client.data.empno = empno;
    // register mapping socketId -> empno in redis for multi-instance

    // เก็บ socket id ว่าใช้โดยใคร (expire เผื่อกรณี client หายไปเฉยๆ)
    this.redis.set(`socket:${sid}`, empno, 'EX', 60 * 60 * 24); // ตัวอย่าง expire 1 วัน
    // เก็บชุด socket id ของ user นี้
    this.redis.sadd(`userSockets:${empno}`, sid);


    this.logger.log(`CONNECT ${empno} (${sid})`);
  }

  handleDisconnect(client: Socket) {
    const sid = client.id;
    const empno = client.data.empno;

    this.redis.srem(`userSockets:${empno}`, sid);
    this.redis.del(`socket:${sid}`);


    // this.redis.get(`socket:${sid}`).then((empno) => {
    //   if (empno) {
    //     this.redis.srem(`userSockets:${empno}`, sid);
    //   }
    //   this.redis.del(`socket:${sid}`);
    // });
    this.logger.log(`DISCONNECT ${sid}`);
  }

  @SubscribeMessage('logout')
  handleLogout(@ConnectedSocket() client: Socket) {
    const empno = client.data.empno; // ดึง empno จาก client
    // const sockets = this.owner.get(empno); // หาว่า empno นี้มี socketId อะไรบ้าง
    // if (sockets) {
    //   for (const clientId of sockets) {
    //     // ปลดล็อกไอเท็มที่ล็อกไว้ทั้งหมด
    //     const items = this.socketLocks.get(clientId); // หาว่า clientId นี้ล็อกไอเท็มอะไรบ้าง
    //     if (items) {
    //       for (const itemId of items) {
    //         this.lockedItems.delete(itemId); // ลบไอเท็มออกจาก lockedItems
    //         this.logger.log(`AUTO-UNLOCK: ${itemId} by ${empno}`);
    //       }
    //       this.socketLocks.delete(clientId); // ลบ clientId ออกจาก socketLocks
    //     }
    //   }
    //   this.owner.delete(empno); // ลบ empno ออกจาก owner
    // }

    // ปิดการเชื่อมต่อ
    client.disconnect(true);
    this.logger.log(`LOGOUT: ${empno} (${client.id})`);
  }


  @SubscribeMessage('lock_item')
  async handleLockItem(
    @MessageBody() data: { itemId: string; order: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { itemId, order } = data;
    const key = `lock:${itemId}::${order}`;
    // const expire = 30 * 60 * 1000; // 30 minutes
    const expire = 5 * 1000; // 5 seconds for testing
    const res = await this.redis.set(key, client.id, 'PX', expire, 'NX');
    this.logger.log(`res', ${res}`);
    if (res === 'OK') {
      const warnKey = `warn:${client.data.empno}::${itemId}::${order}`;
      await this.redis.set(warnKey, client.id, 'PX', expire - 30 * 1000); // เตือนล่วงหน้า 30 วินาที
      client.emit('lock_status', { itemId, order, status: true });
    } else {
      const ownerSid = await this.redis.get(key);
      const ownerEmp = await this.redis.get(`socket:${ownerSid}`);
      this.logger.log(`lock_item failed: ${itemId}::${order} by ${client.data.empno}, owned by ${ownerEmp}`);
      client.emit('lock_status', {
        itemId,
        order,
        status: false,
        owner: await this.usersService.findEmp(ownerEmp),
      });
    }
  }

  @SubscribeMessage('unlock_item')
  async handleUnlockItem(
    @MessageBody() data: { itemId: string; order: string },
    @ConnectedSocket() client: Socket,
  ) {
    const key = `lock:${data.itemId}::${data.order}`;
    // safe unlock (only owner)
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    await this.redis.eval(script, 1, key, client.id);
    client.emit('lock_status', {
      itemId: data.itemId,
      order: data.order,
      status: false,
    });
  }
}
