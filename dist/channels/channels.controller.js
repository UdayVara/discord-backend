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
exports.ChannelsController = void 0;
const common_1 = require("@nestjs/common");
const channels_service_1 = require("./channels.service");
const createchannel_dto_1 = require("./dto/createchannel.dto");
const updatechannel_dto_1 = require("./dto/updatechannel.dto");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../Guards/auth/auth.guard");
const chat_service_1 = require("../chat/chat.service");
let ChannelsController = class ChannelsController {
    constructor(channelsService, chatService) {
        this.channelsService = channelsService;
        this.chatService = chatService;
    }
    async create(createChanneldto, req) {
        return this.channelsService.create(createChanneldto, req?.user?.id);
    }
    findAll(req, serverId) {
        return this.channelsService.findAll(req.user.id, serverId);
    }
    findOne(id, req) {
        return this.channelsService.findOne(id, req.user.id);
    }
    search(serverId, query) {
        return this.channelsService.search(query, serverId);
    }
    async getChats(channelId, isPesonal, req) {
        return await this.chatService.findAll(isPesonal, req?.user.id, channelId);
    }
    update(id, data, req) {
        return this.channelsService.update(id, data, req.user.id);
    }
    remove(id, req) {
        return this.channelsService.remove(id, req.user.id);
    }
};
exports.ChannelsController = ChannelsController;
__decorate([
    (0, common_1.Post)(''),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createchannel_dto_1.createChannelDto, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/get/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('/search/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('/chats/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)("isPersonal")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getChats", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updatechannel_dto_1.updateChannelDto, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "remove", null);
exports.ChannelsController = ChannelsController = __decorate([
    (0, swagger_1.ApiTags)('Channel'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('channel'),
    __metadata("design:paramtypes", [channels_service_1.ChannelsService, chat_service_1.ChatService])
], ChannelsController);
//# sourceMappingURL=channels.controller.js.map