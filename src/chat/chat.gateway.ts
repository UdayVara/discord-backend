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
import { SendMessageDto } from './dto/send-message.dto';

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
  async handleConnection(client: Socket) {
    console.log('User Connected With ID : ', client.id,client.handshake.auth.id);

    const res = await this.chatService.setSocketId(client.id,client.handshake.auth.id)

    console.log(res)
    
  }

  async handleDisconnect(client: Socket) {
    console.log('User Disconnected With ID : ', client.id,client.handshake.auth.id);


    await this.chatService.resetSocketId(client.handshake.auth.id);
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

  @SubscribeMessage("send-message")
  async sendMessage(@ConnectedSocket() socket:Socket,@MessageBody() sendMessageDto:SendMessageDto){
    console.log("Message Received",sendMessageDto)
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

}
