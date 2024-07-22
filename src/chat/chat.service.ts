import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JoinChatDto } from './dto/join-chat.dto';
import { WsException } from '@nestjs/websockets';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma:PrismaService){}
  create(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  async setSocketId(socketId,user){
    try {
      console.log("user id",user)
      const updateSocket = this.prisma.users.update({
        where:{
          id:user.id
        },
        data:{
          socketId
        }
      })

      if(updateSocket){
        return true
      }
    } catch (error) {
      console.log("error",error)
      throw new WsException("Internal Server Error")
    }
  }
  async joinRoom(joinChatDto:JoinChatDto){
    try {
      const channelId = await this.prisma.channels.findFirst({
        where:{
          id:joinChatDto.channelId
        }
      })
      return channelId.id
    } catch (error) {
      throw new WsException("Internal Server Error")
    }
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
