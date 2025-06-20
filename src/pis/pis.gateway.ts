<<<<<<< HEAD
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { PisService } from './pis.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class PisGateway {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      console.log('Connected'); 
    });
    // this.server.emit('test', { message: 'PisGateway is ready' });
  }

   handleConnection(client: Socket) {
    // client.id คือ session id ของแต่ละคน
    console.log('Client connected:', client.id);
    // อาจจะเก็บไว้ใน array หรือ map ก็ได้
  }

   handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    // ลบ client.id ออกจาก map ด้วย (ถ้า track state)
  }


  @SubscribeMessage('message')
  onNewMessage(@MessageBody() body:any){
    console.log('Received message:', body);
    this.server.emit('message', {
        msg: 'New Message',
        content: body
    });
  }

=======
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { PisService } from './pis.service';
import { CreatePiDto } from './dto/create-pi.dto';
import { UpdatePiDto } from './dto/update-pi.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PisGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(PisGateway.name);
  private activeOrderViewers: Map<string, { viewerId: string }> = new Map();

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // When a client disconnects, remove them from any active viewing sessions
    this.activeOrderViewers.forEach((value, orderId) => {
      if (value.viewerId === client.id) {
        this.activeOrderViewers.delete(orderId);
        // Inform other clients that this order is no longer being viewed by anyone (or just this specific client)
        this.server.emit('orderViewing', {
          orderId: orderId,
          viewerId: client.id,
          isViewing: false,
        });
      }
    });
  }

  @SubscribeMessage('pisopen')
  handleOrderOpened(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string },
  ): void {
    const { orderId } = data;
    this.logger.log(`Client ${client.id} opened order: ${orderId}`);

    // Store that this order is being viewed by this client
    this.activeOrderViewers.set(orderId, { viewerId: client.id });

    // Emit to all clients (including the sender) that this order is now being viewed
    // This allows all clients to update their UI to show the 'viewing-indicator'
    this.server.emit('orderViewing', {
      orderId: orderId,
      viewerId: client.id,
      isViewing: true,
    });
  }

  @SubscribeMessage('pisclose')
  handleOrderClosed(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string },
  ): void {
    const { orderId } = data;
    this.logger.log(`Client ${client.id} closed order: ${orderId}`);

    // Remove from active viewers if this client was viewing it
    if (this.activeOrderViewers.get(orderId)?.viewerId === client.id) {
      this.activeOrderViewers.delete(orderId);
    }

    // Emit to all clients that this order is no longer being viewed by this client
    // This allows clients to remove the 'viewing-indicator'
    this.server.emit('orderViewing', {
      orderId: orderId,
      viewerId: client.id,
      isViewing: false,
    });
  }
>>>>>>> b3479b8846c753c0de13c0fb9cae2625a82670ac
}
