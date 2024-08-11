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
exports.ServerController = void 0;
const common_1 = require("@nestjs/common");
const server_service_1 = require("./server.service");
const create_server_dto_1 = require("./dto/create-server.dto");
const update_server_dto_1 = require("./dto/update-server.dto");
const auth_guard_1 = require("../Guards/auth/auth.guard");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const set_role_dto_1 = require("./dto/set-role.dto");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
let ServerController = class ServerController {
    constructor(serverService) {
        this.serverService = serverService;
    }
    async create(createServerDto, req, file) {
        cloudinary_1.v2.config({
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            secure: true
        });
        const stream = stream_1.Readable.from(file.buffer);
        const upload_result = await new Promise((resolve, reject) => {
            const streamLoad = cloudinary_1.v2.uploader.upload_stream({ resource_type: 'auto', folder: 'discord-clone' }, (err, result) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(result);
            });
            stream.pipe(streamLoad);
        });
        return this.serverService.create(createServerDto, req.user.id, upload_result?.secure_url || '');
    }
    findAll(req) {
        return this.serverService.findAll(req.user.id);
    }
    findOne(id, req) {
        return this.serverService.findOne(id, req.user.id);
    }
    update(id, data, File, req) {
        return this.serverService.update(id, data, File.originalname || '', req.user.id);
    }
    remove(id, req) {
        return this.serverService.remove(id, req.user.id);
    }
    joinServer(serverId, req) {
        return this.serverService.joinServer(serverId, req.user.id);
    }
    leaveServer(serverId, req) {
        return this.serverService.leaveServer(serverId, req.user.id);
    }
    getRole(serverId, req) {
        return this.serverService.getRole(serverId, req.user.id);
    }
    setRole(data, req) {
        return this.serverService.setRole(data, req.user.id);
    }
    getMembers(serverId, req) {
        return this.serverService.getMembers(serverId, req.user.id);
    }
};
exports.ServerController = ServerController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_server_dto_1.CreateServerDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ServerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ServerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ServerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.diskStorage)({
            destination(req, file, callback) {
                callback(null, 'public/server-images');
            },
            filename(req, file, callback) {
                callback(null, req.user.id + file.originalname);
            },
        }),
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_server_dto_1.updateServerDto, Object, Object]),
    __metadata("design:returntype", void 0)
], ServerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ServerController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('join/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ServerController.prototype, "joinServer", null);
__decorate([
    (0, common_1.Delete)('leave/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ServerController.prototype, "leaveServer", null);
__decorate([
    (0, common_1.Get)('role/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ServerController.prototype, "getRole", null);
__decorate([
    (0, common_1.Patch)('role/set'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [set_role_dto_1.SetRoleDto, Object]),
    __metadata("design:returntype", void 0)
], ServerController.prototype, "setRole", null);
__decorate([
    (0, common_1.Get)('members/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ServerController.prototype, "getMembers", null);
exports.ServerController = ServerController = __decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiTags)('Server'),
    (0, common_1.Controller)('server'),
    __metadata("design:paramtypes", [server_service_1.ServerService])
], ServerController);
//# sourceMappingURL=server.controller.js.map