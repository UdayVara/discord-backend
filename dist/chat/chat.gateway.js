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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const chat_service_1 = require("./chat.service");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const socket_filter_1 = require("../http Filters/socket.filter");
const socket_auth_guard_1 = require("../Guards/socket-auth/socket-auth.guard");
const join_chat_dto_1 = require("./dto/join-chat.dto");
const send_message_dto_1 = require("./dto/send-message.dto");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
let ChatGateway = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async handleConnection(client) {
        console.log('User Connected With ID : ', client.id, client.handshake.auth.id);
        await this.chatService.setSocketId(client.id, client.handshake.auth.id);
        const serverList = await this.chatService.getAllServers(client.handshake.auth.id);
        console.log(`Client ${client.id} has Joined, Servers : ${serverList}`);
        client.join([...serverList]);
    }
    async handleDisconnect(client) {
        console.log('User Disconnected With ID : ', client.id, client.handshake.auth.id);
        client.disconnect();
        await this.chatService.resetSocketId(client.handshake.auth.id);
    }
    hey(client, message) {
        console.debug('A message from ', client.id, ' recieved and it is', message);
        return { statusCode: 201, message: 'Event Recieved' };
    }
    async joinRoom(socket, joinChatDto) {
        const channelId = await this.chatService.joinRoom(joinChatDto);
        if (channelId && !socket.rooms.has(channelId)) {
            console.log(`socket ${socket.id} Joined ${channelId}`);
            socket.join(channelId);
        }
    }
    async sendMessage(socket, sendMessageDto) {
        try {
            let file_url;
            if (sendMessageDto.file) {
                cloudinary_1.v2.config({
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET,
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    secure: true
                });
                const stream = stream_1.Readable.from(sendMessageDto.file);
                const upload_result = await new Promise((resolve, reject) => {
                    const streamLoad = cloudinary_1.v2.uploader.upload_stream({ resource_type: "auto", folder: "discord-clone" }, (err, result) => {
                        if (err) {
                            console.log(err);
                            return reject(err);
                        }
                        resolve(result);
                    });
                    stream.pipe(streamLoad);
                });
                file_url = upload_result.secure_url;
            }
            const res = await this.chatService.sendMessage(sendMessageDto, socket.handshake.auth.id, file_url || "");
            if (res.success) {
                if (!sendMessageDto.isPersonal) {
                    socket
                        .to(sendMessageDto.channelId)
                        .emit('recieve-message', res.message);
                    socket.emit('recieve-message', res.message);
                    console.log("Server ID", res.message?.channel?.serverId);
                    socket.to(res.message?.channel?.serverId).emit('new-notification', {
                        success: true,
                        message: `New Message from ${res?.message?.user?.username} in ${res.message?.channel?.name} Channel`,
                    });
                }
                else {
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
            }
            else {
                throw new websockets_1.WsException('Internal Server Error');
            }
        }
        catch (error) {
            throw new websockets_1.WsException(error.message || 'Internal Server Error');
        }
    }
    findAll() { }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('hey'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "hey", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        join_chat_dto_1.JoinChatDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send-message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "sendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findAllChat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "findAll", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'http://localhost:3000',
        },
        transports: ['websocket', 'polling'],
    }),
    (0, common_1.UseGuards)(socket_auth_guard_1.SocketAuthGuard),
    (0, common_1.UseFilters)(new socket_filter_1.CustomWsExceptionFilter()),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map