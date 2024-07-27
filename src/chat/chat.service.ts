import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JoinChatDto } from './dto/join-chat.dto';
import { WsException } from '@nestjs/websockets';
import { PrismaService } from 'src/common/services/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}
  create(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  async setSocketId(socketId: string, user: string) {
    try {
      // console.log("user id",user)
      const updateSocket = await this.prisma.users.update({
        where: {
          id: user,
        },
        data: {
          socketId,
        },
      });

      if (updateSocket) {
        return true;
      }
    } catch (error) {
      console.log('error', error);
      throw new WsException('Internal Server Error');
    }
  }

  async resetSocketId(userId: string) {
    try {
      const res = await this.prisma.users.update({
        where:{
          id:userId
        },
        data:{
          socketId:""
        }
      });

      if(res){
        return true
      }
    } catch (error) {
      return false;
    }
  }
  async joinRoom(joinChatDto: JoinChatDto) {
    try {
      const channelId = await this.prisma.channels.findFirst({
        where: {
          id: joinChatDto.channelId,
        },
      });
      return channelId.id;
    } catch (error) {
      throw new WsException('Internal Server Error');
    }
  }

  findAll() {
    return `This action returns all chat`;
  }

  async sendMessage(sendMessageDto:SendMessageDto,userId:string){
    try {
      const message = await this.prisma.messages.create({
        data:{
          isDeleted:false,
          isEdited:false,
          message:sendMessageDto.message,
          channelId:sendMessageDto.channelId,
          fileurl:"",
          userId:userId
        }
      })

      if(message){
        return {success:true,message}
      }else{
        return {success:false}
      }
    } catch (error) {
      throw new WsException(error.message || "Internal Server Error")
    }
    
  }
}
