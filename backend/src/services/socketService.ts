import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { sysLog } from './logger';

class SocketService {
  private io: SocketServer | null = null;

  init(server: HttpServer) {
    try {
      this.io = new SocketServer(server, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
          credentials: true,
        },
        transports: ['websocket'],
      });

      this.io.on('connection', (socket) => {
        sysLog.info(`⚡ Real-time Socket Client Connected: ${socket.id}`);

        // Allow clients to join role-based rooms (e.g. 'admin', 'field_agent')
        socket.on('join_room', (room: string) => {
          socket.join(room);
          sysLog.info(`🚪 Client ${socket.id} joined channel/room: ${room}`);
        });

        socket.on('disconnect', () => {
          sysLog.info(`🔌 Socket Client Disconnected: ${socket.id}`);
        });
      });

      sysLog.info('🚀 Kafaale Qaad WebSocket Gateway Initialized successfully');
    } catch (err: any) {
      sysLog.error('❌ Failed to initialize WebSocket Gateway', err);
    }
  }

  /**
   * Broadcast an event to all connected clients
   */
  broadcast(event: string, payload: any) {
    if (!this.io) {
      sysLog.warn(`⚠️ WebSocket Server not initialized. Cannot broadcast: ${event}`);
      return;
    }
    this.io.emit(event, payload);
    sysLog.info(`📣 WebSocket Broadcast: Event '${event}'`, { payload });
  }

  /**
   * Broadcast an event to a specific channel/room
   */
  broadcastToRoom(room: string, event: string, payload: any) {
    if (!this.io) {
      sysLog.warn(`⚠️ WebSocket Server not initialized. Cannot emit to room: ${room}`);
      return;
    }
    this.io.to(room).emit(event, payload);
    sysLog.info(`📣 WebSocket Room Broadcast [${room}]: Event '${event}'`, { payload });
  }
}

export const socketService = new SocketService();
