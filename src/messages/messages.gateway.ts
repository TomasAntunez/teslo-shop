import {
  OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessagesService } from './messages.service';
import { MessageDto } from './dto/message.dto';


@WebSocketGateway({ cors: true })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server; // wss === Web Socket Server


  constructor( private readonly messagesService: MessagesService ) {}


  async handleConnection( client: Socket ) {
    try {
      await this.messagesService.registerClient(client);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit('new-clients', {
      connectedClients: this.messagesService.getConnectedClientIds()
    });
  }

  handleDisconnect( client: Socket ) {
    this.messagesService.removeClient(client.id);

    this.wss.emit('new-clients', {
      connectedClients: this.messagesService.getConnectedClientIds()
    });
  }


  @SubscribeMessage('message-from-client')
  handleMessage( client: Socket, { message }: MessageDto ) {

    this.wss.emit( 'message-from-server', {
      fullName: this.messagesService.getUserFullName(client.id),
      message
    });
  }

}
