import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { JoinChatDto } from './dto/join-chat.dto';
import { WsException } from '@nestjs/websockets';
import { PrismaService } from 'src/common/services/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}
  create() {
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
        where: {
          id: userId,
        },
        data: {
          socketId: '',
        },
      });

      if (res) {
        return true;
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

  async findAll(isPersonal: boolean,senderId:string, channelId: string) {
    try {
      if (!isPersonal) {
        const chats = await this.prisma.messages.findMany({
          where: {
            channelId,
          },
          include: {
            user: true,
          },
          orderBy: {
            updated_at: 'asc',
          },
        });
        return {
          statusCode: 200,
          message: 'Chats Fetched Successfully',
          chats,
        };
      } else {
        const chats = await this.prisma.messages.findMany({
          where: {
            OR: [
              { AND: [{ receiverId: channelId }, { userId: senderId }] },
              { AND: [{ receiverId: senderId }, { userId: channelId }] },
            ],
            // receiverId: channelId,
          },
          include: {
            user: true,
            receivers: true,
          },
          orderBy: {
            updated_at: 'asc',
          },
        });
        return {
          statusCode: 200,
          message: 'Chats Fetched Successfully',
          chats,
        };
      }
    } catch (error) {
      console.debug(error);
      throw new InternalServerErrorException(
        error.message || 'Internal Server Error',
      );
    }
  }

  async sendMessage(sendMessageDto: SendMessageDto, userId: string,file:any) {
    try {
      const message = await this.prisma.messages.create({
        data: {
          isDeleted: false,
          isEdited: false,
          message: sendMessageDto.message,
          channelId: sendMessageDto.isPersonal
            ? null
            : sendMessageDto.channelId,
          fileurl: file || "",
          userId: userId,
          receiverId: sendMessageDto.isPersonal
            ? sendMessageDto.channelId
            : null,
        },
        include: {
          user: true,
          channel: true,
          receivers: true,
        },
      });

      if (message) {
        return { success: true, message };
      } else {
        return { success: false };
      }
    } catch (error) {
      throw new WsException(error.message || 'Internal Server Error');
    }
  }

  async getAllServers(userId: string) {
    const userServers = await this.prisma.servers.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    const memberServers = await this.prisma.members.findMany({
      where: {
        userId: userId,
      },
      include: {
        servers: {
          select: {
            id: true,
          },
        },
      },
    });

    memberServers.map((item) => {
      userServers.push(item.servers);
    });

    const idArray = [];

    userServers.map((item) => {
      idArray.push(item.id);
    });
    return idArray || [];
  }
}
