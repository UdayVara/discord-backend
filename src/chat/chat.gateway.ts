import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WsException,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { UseFilters, UseGuards } from '@nestjs/common';
import { CustomWsExceptionFilter } from 'src/http Filters/socket.filter';
import { SocketAuthGuard } from 'src/Guards/socket-auth/socket-auth.guard';
import { JoinChatDto } from './dto/join-chat.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
  transports: ['websocket', 'polling'],
})
@UseGuards(SocketAuthGuard)
@UseFilters(new CustomWsExceptionFilter())
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;
  handleConnection(client: Socket) {
    console.log('User Connected With ID : ', client.id);
    
  }

  handleDisconnect(client: Socket) {
    console.log('User Disconnected With ID : ', client.id);
  }

  @SubscribeMessage('hey')
  hey(client: Socket, message: string) {
    console.debug('A message from ', client.id, ' recieved and it is', message);
    return { statusCode: 201, message: 'Event Recieved' };
  }
  @SubscribeMessage('join')
  async joinRoom(@ConnectedSocket() socket:Socket,@MessageBody() joinChatDto: JoinChatDto) {
    const channelId =  await this.chatService.joinRoom(joinChatDto);

    if(channelId){
      console.log(`socket ${socket.id} Joined ${channelId}`)
      socket.join(channelId)
    }else{
      throw new WsException("Invalid Channel ID")
    }
  }

  @SubscribeMessage('get-error')
  
  getException(@ConnectedSocket() client: Socket) {
    console.log('Error Event Received');
    // client.emit("error",{message:"Error Event Emitted"})
    throw new WsException('Custom Error MEssage');
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
