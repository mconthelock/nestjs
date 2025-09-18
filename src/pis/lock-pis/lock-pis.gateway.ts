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
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../amec/users/users.service';
// import { CreateLockPiDto } from './dto/create-lock-pi.dto';

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
@Injectable()
export class LockPisGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly UsersService: UsersService) {}
  private lockedItems = new Map<string, string>(); // itemId => socketId
  private socketLocks = new Map<string, Set<string>>(); // socketId => Set<itemId>
  private owner = new Map<string, Set<string>>(); // owner => socketId (เจ้าของไอเท็ม)
  private logger = new Logger('LockPisGateway'); // เขียน log ด้วยชื่อ LockPis

  //   onModuleInit() {
  //     this.server.on('connection', (socket) => {
  //       console.log('Client connected @ /lockpis:', socket.id);
  //       console.log('Connected');
  //     });
  //     // this.server.emit('test', { message: 'PisGateway is ready' });
  //   }

  // เมื่อ connect เข้ามา
  handleConnection(client: Socket) {
    const empno = client.handshake.query.empno as string; // <-- จาก client
    if (!empno) {
      client.disconnect(true); // ถ้าไม่มี empno ให้ตัดการเชื่อมต่อ
      return;
    }

    client.data.empno = empno; // เก็บ empno ใน data ของ client
    this.logger.log(`CONNECT: ${empno} (${client.id})`);

    if (!this.owner.has(empno)) this.owner.set(empno, new Set()); // สร้าง Set ใหม่ถ้า empno ยังไม่มี
    this.owner.get(empno).add(client.id); // เก็บ client.id ใน Set ของ empno
  }

  // เมื่อ disconnect
  handleDisconnect(client: Socket) {
    const lockedByClient = this.socketLocks.get(client.id);
    if (lockedByClient) {
      for (const itemId of lockedByClient) {
        this.lockedItems.delete(itemId);
        this.logger.debug(`Auto-unlocked item: ${itemId}`);
      }
      this.socketLocks.delete(client.id);
    }
    this.logger.debug(`Client disconnected: ${client.id}`);

    const empno = client.data.empno;
    this.logger.log(`DISCONNECT: ${empno} (${client.id})`);

    // ลบ socketId นี้ออกจาก owner
    const sockets = this.owner.get(empno);
    if (sockets) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.owner.delete(empno);
      }
    }
  }

  @SubscribeMessage('lock_item')
  async handleLockItem(
    @MessageBody() data: { itemId: string; order: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { itemId, order } = data;

    const key = `${itemId}::${order}`;

    if (
      this.lockedItems.has(key) && // ถ้าไอเท็มถูกล็อกอยู่แล้ว
      this.lockedItems.get(key) !== client.id // ถ้าไอเท็มถูกล็อกโดยคนอื่น
    ) {
      client.emit('lock_status', {
        itemId,
        order,
        status: false,
        // owner: this.getOwnerByItem(key), // หาว่าใครเป็นเจ้าของไอเท็มนี้
        user: await this.UsersService.findEmp(this.getOwnerByItem(key)),
      });
      return;
    }

    this.lockedItems.set(key, client.id); // เก็บว่าไอเท็มนี้ถูกล็อกโดย client.id

    if (!this.socketLocks.has(client.id)) {
      // ถ้า client.id ยังไม่มีใน socketLocks
      this.socketLocks.set(client.id, new Set()); // สร้าง Set ใหม่
    }
    this.socketLocks.get(client.id).add(key); // เก็บ itemId ใน Set ของ client.id

    client.emit('lock_status', {
      itemId,
      order,
      status: true,
      //   owner: client.data.empno,
      user: await this.UsersService.findEmp(client.data.empno),
    });
  }

  @SubscribeMessage('unlock_item')
  handleUnlockItem(
    @MessageBody() data: { itemId: string; order: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { itemId, order } = data;
    const key = `${itemId}::${order}`;

    if (this.lockedItems.get(key) === client.id) {
      // ถ้าไอเท็มถูกล็อกโดย client.id
      // ปลดล็อกไอเท็ม
      this.lockedItems.delete(key); // ลบไอเท็มออกจาก lockedItems
      this.socketLocks.get(client.id)?.delete(key); // ลบไอเท็มออกจาก Set ของ client.id
      this.logger.debug(`Item unlocked: ${key}`);
    }
  }

  @SubscribeMessage('logout')
  handleLogout(@ConnectedSocket() client: Socket) {
    const empno = client.data.empno; // ดึง empno จาก client
    const sockets = this.owner.get(empno); // หาว่า empno นี้มี socketId อะไรบ้าง
    if (sockets) {
      for (const clientId of sockets) {
        // ปลดล็อกไอเท็มที่ล็อกไว้ทั้งหมด
        const items = this.socketLocks.get(clientId); // หาว่า clientId นี้ล็อกไอเท็มอะไรบ้าง
        if (items) {
          for (const itemId of items) {
            this.lockedItems.delete(itemId); // ลบไอเท็มออกจาก lockedItems
            this.logger.log(`AUTO-UNLOCK: ${itemId} by ${empno}`);
          }
          this.socketLocks.delete(clientId); // ลบ clientId ออกจาก socketLocks
        }
      }
      this.owner.delete(empno); // ลบ empno ออกจาก owner
    }

    // ปิดการเชื่อมต่อ
    client.disconnect(true);
    this.logger.log(`LOGOUT: ${empno} (${client.id})`);
  }

  // ฟังก์ชันช่วยสำหรับหาว่าใครเป็นเจ้าของไอเท็ม
  getOwnerByItem(item: string): string | undefined {
    const socketId = this.lockedItems.get(item);
    if (!socketId) return null;

    for (const [empno, socketSet] of this.owner.entries()) {
      if (socketSet.has(socketId)) {
        return empno;
      }
    }
    return null; // ไม่เจอ
  }
}
