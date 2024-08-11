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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const prisma_service_1 = require("../common/services/prisma.service");
let ChatService = class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create() {
        return 'This action adds a new chat';
    }
    async setSocketId(socketId, user) {
        try {
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
        }
        catch (error) {
            console.log('error', error);
            throw new websockets_1.WsException('Internal Server Error');
        }
    }
    async resetSocketId(userId) {
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
        }
        catch (error) {
            return false;
        }
    }
    async joinRoom(joinChatDto) {
        try {
            const channelId = await this.prisma.channels.findFirst({
                where: {
                    id: joinChatDto.channelId,
                },
            });
            return channelId.id;
        }
        catch (error) {
            throw new websockets_1.WsException('Internal Server Error');
        }
    }
    async findAll(isPersonal, senderId, channelId) {
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
            }
            else {
                const chats = await this.prisma.messages.findMany({
                    where: {
                        OR: [
                            { AND: [{ receiverId: channelId }, { userId: senderId }] },
                            { AND: [{ receiverId: senderId }, { userId: channelId }] },
                        ],
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
        }
        catch (error) {
            console.debug(error);
            throw new common_1.InternalServerErrorException(error.message || 'Internal Server Error');
        }
    }
    async sendMessage(sendMessageDto, userId, file) {
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
            }
            else {
                return { success: false };
            }
        }
        catch (error) {
            throw new websockets_1.WsException(error.message || 'Internal Server Error');
        }
    }
    async getAllServers(userId) {
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
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map