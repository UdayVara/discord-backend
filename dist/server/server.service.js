"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/services/prisma.service");
const client_1 = require("@prisma/client");
let ServerService = class ServerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createServerDto, userId, image) {
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
            }
            else {
                return { statusCode: 400, message: 'Failed To Create New Server' };
            }
        }
        catch (error) {
            console.log('Error', error);
            throw new common_1.InternalServerErrorException();
        }
    }
    async findAll(userId) {
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async findOne(id, userId) {
        try {
            const getServer = await this.prisma.servers.findFirst({
                where: {
                    id: id,
                },
            });
            if (getServer) {
                return {
                    statusCode: 200,
                    message: 'Server Fetched Successfully',
                    server: getServer,
                };
            }
            else {
                return { statusCode: 404, message: 'Server Does Not Exists' };
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async update(id, updateServerDto, image, userId) {
        try {
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
            }
            else {
                throw new common_1.InternalServerErrorException();
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async remove(id, userId) {
        try {
            const deletedServer = await this.prisma.servers.delete({
                where: {
                    id: id,
                    userId: userId,
                },
            });
            if (deletedServer) {
                return { statusCode: 201, message: 'Server Delete Successfully' };
            }
            else {
                return { statusCode: 404, message: 'Server Does not Exists' };
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async joinServer(serverId, userId) {
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
            }
            else {
                const joinIn = await this.prisma.members.create({
                    data: {
                        userId,
                        serverId,
                    },
                });
                if (joinIn) {
                    return { statusCode: 201, message: 'You Succesfully Joined Server' };
                }
                else {
                    throw new common_1.InternalServerErrorException();
                }
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async leaveServer(serverId, userId) {
        try {
            const removeMember = await this.prisma.members.delete({
                where: {
                    userId: userId,
                    serverId: serverId,
                },
            });
            if (removeMember) {
                return { statusCode: 201, message: 'Server Left Successfully' };
            }
            else {
                throw new common_1.InternalServerErrorException();
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async getRole(serverId, userId) {
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
                    role: client_1.RoleType.moderator,
                };
            }
            const result = await this.prisma.members.findFirst({
                where: {
                    serverId,
                    userId,
                },
            });
            if (result) {
                return {
                    statusCode: 200,
                    message: 'Role Fetched Successfully',
                    role: result.role,
                };
            }
            else {
                return {
                    statusCode: 402,
                    message: 'You are Not Member of This Server',
                    role: client_1.RoleType.guest,
                };
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async setRole(setRole, userId) {
        try {
            const member = await this.prisma.members.findFirst({
                where: {
                    id: setRole.memberId,
                },
                include: {
                    servers: true,
                },
            });
            if (member.servers.userId == userId ||
                member.role == client_1.RoleType.moderator) {
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
                }
                else {
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async getMembers(serverId, userId) {
        try {
            const server = await this.prisma.servers.findFirst({
                where: {
                    id: serverId,
                },
                include: {
                    users: true,
                },
            });
            const members = await this.prisma.members.findMany({
                where: {
                    serverId: serverId,
                },
                include: {
                    users: true,
                },
            });
            const temp = { ...server };
            temp.owner = true;
            return {
                statusCode: 201,
                message: 'Members Fetched Successfully',
                members: [temp, ...members] || [],
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException();
        }
    }
};
exports.ServerService = ServerService;
exports.ServerService = ServerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServerService);
//# sourceMappingURL=server.service.js.map