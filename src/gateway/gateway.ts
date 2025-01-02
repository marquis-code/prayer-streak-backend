import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
    });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() socket: Socket, @MessageBody() userId: string) {
    socket.join(userId);
    return { success: true };
  }

  @SubscribeMessage('sendNotification')
  handleNotification(client: Socket, payload: { message: string }): void {
    console.log(`Notification received: ${payload.message}`);
    // Emit notification to all connected clients
    this.server.emit('notification', payload);
  }

  sendNotificationToClient(message: string): void {
    // Emit a notification to all connected clients
    this.server.emit('notification', { message });
  }
}