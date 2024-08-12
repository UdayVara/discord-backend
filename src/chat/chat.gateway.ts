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

import { Server, Socket } from 'socket.io';
import { UseFilters, UseGuards } from '@nestjs/common';
import { CustomWsExceptionFilter } from 'src/http Filters/socket.filter';
import { SocketAuthGuard } from 'src/Guards/socket-auth/socket-auth.guard';
import { JoinChatDto } from './dto/join-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import {v2 as cloudinary} from "cloudinary"
import { Readable } from 'stream';

@WebSocketGateway({
  cors: {
    origin: process.env.APP_URL,
  },
  transports: ['websocket', 'polling'],
})
@UseGuards(SocketAuthGuard)
@UseFilters(new CustomWsExceptionFilter())
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;
  async handleConnection(client: Socket) {
    console.log(
      'User Connected With ID : ',
      client.id,
      client.handshake.auth.id,
    );

    await this.chatService.setSocketId(client.id, client.handshake.auth.id);
    const serverList = await this.chatService.getAllServers(
      client.handshake.auth.id,
    );

    console.log(`Client ${client.id} has Joined, Servers : ${serverList}`)
    client.join([...serverList]);

    //
    // console.log(res)
  }

  async handleDisconnect(client: Socket) {
    console.log(
      'User Disconnected With ID : ',
      client.id,
      client.handshake.auth.id,
    );
    client.disconnect();
    await this.chatService.resetSocketId(client.handshake.auth.id);
  }

  @SubscribeMessage('hey')
  hey(client: Socket, message: string) {
    console.debug('A message from ', client.id, ' recieved and it is', message);
    return { statusCode: 201, message: 'Event Recieved' };
  }
  @SubscribeMessage('join')
  async joinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() joinChatDto: JoinChatDto,
  ) {
    // const rooms = Array.from(socket.rooms).slice(1); // Get all rooms except the default room which is the socket id
    // rooms.forEach((room) => socket.leave(room));
    const channelId = await this.chatService.joinRoom(joinChatDto);

    if (channelId && !socket.rooms.has(channelId)) {
      console.log(`socket ${socket.id} Joined ${channelId}`);
      socket.join(channelId);
    } 
  }

  @SubscribeMessage('send-message')
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() sendMessageDto: SendMessageDto,
  ) {
    try {
      let file_url;
      // console.log(sendMessageDto.file)
      if (sendMessageDto.file) {

        cloudinary.config({
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret:process.env.CLOUDINARY_API_SECRET,
          cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
          secure:true
        })
        const stream = Readable.from(sendMessageDto.file)
        const upload_result:any = await new Promise((resolve,reject)=>{
          const streamLoad = cloudinary.uploader.upload_stream({resource_type:"auto",folder:"discord-clone"},(err,result)=>{
            if(err){
              console.log(err)
              return reject(err)
            }
            resolve(result)
          })
          stream.pipe(streamLoad)
        })

        file_url = upload_result.secure_url
      }
      const res = await this.chatService.sendMessage(
        sendMessageDto,
        socket.handshake.auth.id,
        file_url || "",
      );
      // console.log(res,"Result")
      if (res.success) {
        if (!sendMessageDto.isPersonal) {
          socket
            .to(sendMessageDto.channelId)
            .emit('recieve-message', res.message);
          socket.emit('recieve-message', res.message);
          console.log("Server ID",res.message?.channel?.serverId)
          socket.to(res.message?.channel?.serverId).emit('new-notification', {
            success: true,
            message: `New Message from ${res?.message?.user?.username} in ${res.message?.channel?.name} Channel`,
          });
        } else {
          this.server
            .to(res.message?.receivers?.socketId)
            .emit('recieve-message', res.message);
          socket.emit('recieve-message', res.message);
          this.server
            .to(res.message?.receivers?.socketId)
            .emit('new-notification', {
              success: true,
              message: `New Message from ${res?.message?.user?.username}`,
            });
        }
      } else {
        throw new WsException('Internal Server Error');
      }
    } catch (error) {
      throw new WsException(error.message || 'Internal Server Error');
    }
    // console.log('Message Received', sendMessageDto);
  }

  // @SubscribeMessage('get-error')
  // getException(@ConnectedSocket() client: Socket) {
  //   console.log('Error Event Received');
  //   // client.emit("error",{message:"Error Event Emitted"})
  //   throw new WsException('Custom Error MEssage');
  // }

  @SubscribeMessage('findAllChat')
  findAll() {}
}
