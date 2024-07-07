import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { updateServerDto } from './dto/update-server.dto';
import { PrismaService } from 'src/common/services/prisma.service';
// import * as fs from 'fs';

@Injectable()
export class ServerService {
  constructor(private prisma: PrismaService) {}

  async create(
    createServerDto: CreateServerDto,
    userId: string,
    image: string,
  ) {
    try {
      const checkServer = await this.prisma.servers.findFirst({
        where: {
          name: createServerDto.name,
        },
      });

      if (checkServer) {
        return { statusCode: 403, message: 'Server Already Exists' };
      }
      const newServer = await this.prisma.servers.create({
        data: {
          name: createServerDto.name,
          serverImage: `server-images/${userId + image}`,
          userId: userId,
        },
      });

      if (newServer) {
        return {
          statusCode: 201,
          messaage: 'Server Created Successfully',
          server: newServer,
        };
      } else {
        return { statusCode: 400, message: 'Failed To Create New Server' };
      }
    } catch (error) {
      console.log('Error', error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(userId: string) {
    try {
      const userServers = await this.prisma.servers.findMany({
        where: {
          userId: userId,
        },
      });

      return {
        statusCode: 201,
        message: 'Servers Fetched Successfully',
        servers: userServers,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const getServer = await this.prisma.servers.findFirst({
        where: {
          userId: userId,
          id: id,
        },
      });

      if (getServer) {
        return {
          statusCode: 201,
          message: 'Server Fetched Successfully',
          server: getServer,
        };
      } else {
        return { statusCode: 404, message: 'Server Does Not Exists' };
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, updateServerDto: updateServerDto, image: string,userId:string) {
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

      const server = await this.prisma.servers.update({
        where: {
          id: id,
        },
        data: {
          name: updateServerDto.name,
          serverImage: image,
          updated_at: new Date(),
        },
      });

      if (server) {
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
      const deletedServer = await this.prisma.servers.delete({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (deletedServer) {
        return { statusCode: 201, message: 'Server Delete Successfully' };
      } else {
        return { statusCode: 404, message: 'Server Does not Exists' };
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
