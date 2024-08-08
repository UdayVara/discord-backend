import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { updateServerDto } from './dto/update-server.dto';
import { PrismaService } from 'src/common/services/prisma.service';
import { RoleType } from '@prisma/client';
import { SetRoleDto } from './dto/set-role.dto';
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
          serverImage: image,
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

      const memberServers = await this.prisma.members.findMany({
        where: {
          userId: userId,
        },
        include: {
          servers: true,
        },
      });

      memberServers.map((item, index) => {
        userServers.push(item.servers);
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
          // userId: userId,
          id: id,
        },
      });

      if (getServer) {
        return {
          statusCode: 200,
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

  async update(
    id: string,
    updateServerDto: updateServerDto,
    image: string,
    userId: string,
  ) {
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

  async joinServer(serverId: string, userId: string) {
    try {
      const getServer = await this.prisma.servers.findFirst({
        where: {
          id: serverId,
        },
      });

      if (getServer.userId == userId) {
        return { statusCode: 402, message: 'You Cannot Join Your Own Channel' };
      }

      const checkMember = await this.prisma.members.findFirst({
        where: {
          serverId,
          userId,
        },
      });

      if (checkMember) {
        return { statusCode: 303, message: 'You Are Already Member' };
      } else {
        const joinIn = await this.prisma.members.create({
          data: {
            userId,
            serverId,
          },
        });

        if (joinIn) {
          return { statusCode: 201, message: 'You Succesfully Joined Server' };
        } else {
          throw new InternalServerErrorException();
        }
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async leaveServer(serverId: string, userId: string) {
    try {
      const removeMember = await this.prisma.members.delete({
        where: {
          userId: userId,
          serverId: serverId,
        },
      });

      if (removeMember) {
        return { statusCode: 201, message: 'Server Left Successfully' };
      } else {
        throw new InternalServerErrorException();
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getRole(serverId: string, userId: string) {
    try {
      const server = await this.prisma.servers.findFirst({
        where: {
          id: serverId,
        },
      });
      if (server.userId == userId) {
        return {
          statusCode: 200,
          message: 'Role Fetched Successfully',
          role: RoleType.moderator,
        };
      }
      const result = await this.prisma.members.findFirst({
        where: {
          serverId,
          userId,
        },
      });
      // console.log(result.role);
      if (result) {
        return {
          statusCode: 200,
          message: 'Role Fetched Successfully',
          role: result.role,
        };
      } else {
        return {
          statusCode: 402,
          message: 'You are Not Member of This Server',
          role: RoleType.guest,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async setRole(setRole: SetRoleDto, userId: string) {
    try {
      const member = await this.prisma.members.findFirst({
        where: {
          id: setRole.memberId,
        },
        include: {
          servers: true,
        },
      });

      if (
        member.servers.userId == userId ||
        member.role == RoleType.moderator
      ) {
        const updateRole = await this.prisma.members.update({
          where: {
            id: setRole.memberId,
          },
          data: {
            role: setRole.role,
          },
        });

        if (updateRole) {
          return {
            statusCode: 201,
            message: 'Role Updated Successfully',
          };
        } else {
          return {
            statusCode: 400,
            message: 'Failed to Update Role',
          };
        }
      }

      return {
        statusCode: 400,
        message: "You Don't have acess to Perform this operation",
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getMembers(serverId: string, userId: string) {
    try {
      const server = await this.prisma.servers.findFirst({
        where: {
          id: serverId,
        },
        include: {
          users: true,
        },
      });
      // console.debug(server,"server")
      // if (server.userId == userId ) {
      const members = await this.prisma.members.findMany({
        where: {
          serverId: serverId,
        },
        include: {
          users: true,
        },
      });

      const temp: any = { ...server };
      temp.owner = true;
      return {
        statusCode: 201,
        message: 'Members Fetched Successfully',
        members: [temp, ...members] || [],
      };
      // }

      // throw new ForbiddenException();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
