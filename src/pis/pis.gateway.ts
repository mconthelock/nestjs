import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/api/pis/' })
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
  onNewMessage(@MessageBody() body: any) {
    console.log('Received message:', body);
    this.server.emit('message', {
      msg: 'New Message',
      content: body,
    });
  }
}
