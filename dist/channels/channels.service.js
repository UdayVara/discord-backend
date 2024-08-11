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
exports.ChannelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/services/prisma.service");
const createchannel_dto_1 = require("./dto/createchannel.dto");
const chat_service_1 = require("../chat/chat.service");
let ChannelsService = class ChannelsService {
    constructor(prisma, chatService) {
        this.prisma = prisma;
        this.chatService = chatService;
    }
    async create(createChanneldto, userId) {
        try {
            const checkChannel = await this.prisma.servers.findFirst({
                where: {
                    name: createchannel_dto_1.createChannelDto.name,
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
            }
            else {
                return { statusCode: 400, message: 'Failed To Create New Channel' };
            }
        }
        catch (error) {
            console.log('Error', error);
            throw new common_1.InternalServerErrorException();
        }
    }
    async findAll(userId, serverId) {
        try {
            const userChannels = await this.prisma.channels.findMany({
                where: {
                    serverId: serverId,
                },
            });
            const groupedChannels = userChannels.reduce((acc, item) => {
                if (!acc[item.type]) {
                    acc[item.type] = [];
                }
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async findOne(id, userId) {
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
            }
            else {
                return { statusCode: 404, message: 'Channel Does Not Exists' };
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async update(id, updateChanneldto, userId) {
        try {
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
            const deleteChannel = await this.prisma.channels.delete({
                where: {
                    id: id,
                    userId: userId,
                },
            });
            if (deleteChannel) {
                return { statusCode: 201, message: 'Channel Delete Successfully' };
            }
            else {
                return { statusCode: 404, message: 'Channel Does not Exists' };
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async search(query, serverId) {
        try {
            const channels = await this.prisma.channels.findMany({
                where: {
                    name: {
                        contains: query,
                    },
                    serverId: serverId,
                },
            });
            const groupedChannels = channels.reduce((acc, item) => {
                if (!acc[item.type]) {
                    acc[item.type] = [];
                }
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
};
exports.ChannelsService = ChannelsService;
exports.ChannelsService = ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, chat_service_1.ChatService])
], ChannelsService);
//# sourceMappingURL=channels.service.js.map