import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { createChannelDto } from './dto/createchannel.dto';
import { updateChannelDto } from './dto/updatechannel.dto';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService,private readonly chatService:ChatService) {}

  async create(createChanneldto: createChannelDto, userId: string) {
    try {
      const checkChannel = await this.prisma.servers.findFirst({
        where: {
          name: createChannelDto.name,
          userId: userId,
        },
      });

      if (checkChannel) {
        return { statusCode: 403, message: 'Channel Already Exists' };
      }
      const createChannel = await this.prisma.channels.create({
        data: {
          name: createChanneldto.name,
          serverId: createChanneldto.serverId,
          type: createChanneldto.type,
          userId: userId,
        },
      });

      if (createChannel) {
        return {
          statusCode: 201,
          messaage: 'Channel Created Successfully',
          server: createChannel,
        };
      } else {
        return { statusCode: 400, message: 'Failed To Create New Channel' };
      }
    } catch (error) {
      console.log('Error', error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(userId: string, serverId: string) {
    try {
      const userChannels = await this.prisma.channels.findMany({
        where: {
          serverId: serverId,
        },
      });

      // const groupedChannels = userChannels
      // Object.groupBy
      const groupedChannels: any = userChannels.reduce((acc, item) => {
        // If the type doesn't exist in the accumulator, create an array for it
        if (!acc[item.type]) {
          acc[item.type] = [];
        }

        // Push the current item into the array for its type
        acc[item.type].push(item);

        return acc;
      }, {});

      return {
        statusCode: 201,
        message: 'Channels Fetched Successfully',
        textChannels: groupedChannels?.text || [],
        audioChannels: groupedChannels?.audio || [],
        videoChannels: groupedChannels?.video || [],
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const getChannel = await this.prisma.channels.findFirst({
        where: {
          userId: userId,
          id: id,
        },
      });

      if (getChannel) {
        return {
          statusCode: 201,
          message: 'Channel Fetched Successfully',
          channel: getChannel,
        };
      } else {
        return { statusCode: 404, message: 'Channel Does Not Exists' };
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, updateChanneldto: updateChannelDto, userId: string) {
    try {
      // const getServer = await this.prisma.servers.findFirst({
      //   where: {
      //     name: updateServerDto.name,
      //   },
      // });

      // if (
      //   fs.existsSync(`public/server-images/${userId + getServer?.serverImage}`)
      // ) {
      //   fs.rmSync(`public/server-images/${userId + getServer?.serverImage}`);
      // }

      const channel = await this.prisma.channels.update({
        where: {
          id: id,
        },
        data: {
          name: updateChanneldto.name,
          userId: userId,
          type: updateChanneldto.type,
          updated_at: new Date(),
        },
      });

      if (channel) {
        return { statusCode: 201, message: 'Server Updated Successfully' };
      } else {
        throw new InternalServerErrorException();
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string, userId: string) {
    try {
      const deleteChannel = await this.prisma.channels.delete({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (deleteChannel) {
        return { statusCode: 201, message: 'Channel Delete Successfully' };
      } else {
        return { statusCode: 404, message: 'Channel Does not Exists' };
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async search(query: string, serverId) {
    try {
      const channels = await this.prisma.channels.findMany({
        where: {
          name: {
            contains: query,
          },
          serverId: serverId,
        },
      });

      const groupedChannels: any = channels.reduce((acc, item) => {
        // If the type doesn't exist in the accumulator, create an array for it
        if (!acc[item.type]) {
          acc[item.type] = [];
        }

        // Push the current item into the array for its type
        acc[item.type].push(item);

        return acc;
      }, {});

      const members = await this.prisma.members.findMany({
        where: {
          users: {
            OR: [{ username: { contains: query }, email: { contains: query } }],
          },
          serverId: serverId,
        },
      });

      return {
        statusCode: 200,
        message: 'Result Fetched Successfully',
        textChannels: groupedChannels?.text || [],
        audioChannels: groupedChannels?.audio || [],
        videoChannels: groupedChannels?.video || [],
        members: members,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  
}
