import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { User } from 'src/users/entities/user.entity';

import { ConnectedClients } from './interfaces/connected-clients.interface';


@Injectable()
export class MessagesService {

  private connectedClients: ConnectedClients = {};


  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository( User )
    private readonly userRepository: Repository<User>
  ) {}


  async registerClient( client: Socket ) {
    const token = client.handshake.headers.authentication as string;
    const { id } = this.jwtService.verify<JwtPayload>( token );

    const user = await this.userRepository.findOneBy({ id });

    console.log({ user, socketId: client.id });

    if (!user || !user.isActive) throw new Error();

    this.checkConnection( user );

    this.connectedClients[client.id] = { socket: client, user };

    console.log({ fromBefore: this.connectedClients });
  }

  removeClient( clientId: string ) {
    delete this.connectedClients[clientId];
  }

  getConnectedClientIds() {
    return Object.keys( this.connectedClients );
  }

  getUserFullName( clientId: string ) {
    return this.connectedClients[clientId].user.fullName;
  }


  private checkConnection( user: User ) {

    for ( const clientId of Object.keys( this.connectedClients ) ) {

      const connectedClient = this.connectedClients[clientId];

      if ( connectedClient.user.id === user.id ) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }

}
