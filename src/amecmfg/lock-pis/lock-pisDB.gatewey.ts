import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayConnection,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../amec/users/users.service';
import { LockPisService } from './lock-pis.service';

// https://amecweb2.mitsubishielevatorasia.co.th/lockpis?empno=24008
@WebSocketGateway({ namespace: '/lockpisDB' })
@Injectable()
export class LockPisDBGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly UsersService: UsersService,
    private readonly LockPisService: LockPisService,
  ) {}
  private logger = new Logger('LockPisGateway'); // เขียน log ด้วยชื่อ LockPis

  // เมื่อ connect เข้ามา
  handleConnection(client: Socket) {
    const empno = client.handshake.query.empno as string; // <-- จาก client
    // ถ้าไม่มี empno ใน query string ให้ตัดการเชื่อมต่อ
    if (!empno) {
      client.disconnect(true);
      return;
    }
    client.data.empno = empno; // เก็บ empno ใน data ของ client
    this.logger.log(`CONNECT: ${empno} (${client.id})`);
  }

  // เมื่อ disconnect
  handleDisconnect(client: Socket) {
    const socketId = client.id;
    const empno = client.data.empno;

    this.LockPisService.disconnect(socketId);
    this.logger.log(`DISCONNECT: ${empno} (${client.id})`);

  }

  @SubscribeMessage('lock_item')
  async handleLockItem(
    @MessageBody() data: { itemId: string; order: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { itemId, order } = data;
    const empno = client.data.empno as string;
    this.logger.log(
      `LOCK REQUEST: ${empno} wants to lock ${itemId}/${order} clientId=${client.id}`,
    );

    const existing = await this.LockPisService.findOne(itemId, order);
    if (existing) {
      if (existing.LOCKED_BY_EMPNO === empno) {
        // ล็อกโดยเจ้าของเดิม
        this.logger.log(
          `LOCK RE-ENTER: ${empno} re-locked ${itemId}/${order} clientId=${client.id}`,
        );
        client.emit('lock_status', {
          itemId,
          order,
          status: true,
        });
      } else {
        // มีคนล็อกอยู่
        this.logger.log(
          `LOCK DENIED: ${empno} denied to lock ${itemId}/${order} clientId=${client.id} (owner=${existing.LOCKED_BY_EMPNO})`,
        );
        client.emit('lock_status', {
          itemId,
          order,
          status: false,
          user: await this.UsersService.findEmp(existing.LOCKED_BY_EMPNO),
        });
      }
      return;
    }

    const res = await this.LockPisService.lock({
      ITEM_NO: itemId,
      ORD_NO: order,
      LOCKED_BY_EMPNO: empno,
      SOCKET_ID: client.id,
    });
    if (res.status) {
      client.emit('lock_status', {
        itemId,
        order,
        status: true,
        user: await this.UsersService.findEmp(empno),
      });
      this.logger.log(
        `LOCK GRANTED: ${empno} locked ${itemId}/${order} clientId=${client.id}`,
      );
      return;
    }
  }

  @SubscribeMessage('unlock_item')
  handleUnlockItem(
    @MessageBody() data: { itemId: string; order: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.LockPisService.unlock(data.itemId, data.order, client.id);
    client.emit('unlock_status', {
      itemId: data.itemId,
      order: data.order,
      status: true,
    });
  }

  @SubscribeMessage('logout')
  handleLogout(@ConnectedSocket() client: Socket) {
    const empno = client.data.empno as string;
    // ล้างข้อมูลการล็อกทั้งหมดของผู้ใช้คนนี้
    this.LockPisService.logout(client.data.empno);

    // ปิดการเชื่อมต่อ
    client.disconnect(true);
    this.logger.log(`LOGOUT: ${empno} (${client.id})`);
  }
}
