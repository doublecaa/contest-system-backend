import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly jwtService: JwtService) { }

  @WebSocketServer()
  server: Server;

  private getUser(socket: Socket) {
    const token = socket.handshake.auth?.token;
    if (!token) return null;

    // NOTE: demo only (should use verify in production)
    try {
      return this.jwtService.decode(token);
    } catch {
      return null;
    }
  }

  async handleConnection(socket: Socket) {
    const user = this.getUser(socket);

    if (!user) {
      socket.disconnect();
      return;
    }

    // join room
    socket.join('general');

    // count online users
    const sockets = await this.server.in('general').fetchSockets();
    this.server.emit('onlineUsers', sockets.length);

    console.log(`Client connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket) {
    const sockets = await this.server.in('general').fetchSockets();
    this.server.emit('onlineUsers', sockets.length);

    console.log(`Client disconnected: ${socket.id}`);
  }
}