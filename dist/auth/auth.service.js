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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/services/prisma.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async signup(credentials) {
        try {
            const chekUser = await this.prisma.users.findFirst({
                where: {
                    email: credentials.email
                }
            });
            if (chekUser) {
                return { statusCode: 403, message: "User With Email Already Exists" };
            }
            else {
                console.log(process.env.SALT_ROUNDS);
                const hashedPassword = bcrypt.hashSync(credentials.password, +process.env.SALT_ROUNDS);
                const newUser = await this.prisma.users.create({
                    data: {
                        ...credentials,
                        password: hashedPassword
                    }
                });
                if (newUser) {
                    const token = this.jwt.sign({ id: newUser.id });
                    return { statusCode: 201, message: "User Signup Successfully", token: token, user: newUser };
                }
                else {
                    return new common_1.InternalServerErrorException();
                }
            }
        }
        catch (error) {
            console.log("error", error);
            throw new common_1.InternalServerErrorException();
        }
    }
    async signin(credentials) {
        try {
            const chekUser = await this.prisma.users.findFirst({
                where: {
                    email: credentials.email
                }
            });
            if (chekUser) {
                const comaprePass = bcrypt.compareSync(credentials.password, chekUser.password);
                if (comaprePass) {
                    const token = this.jwt.sign({ id: chekUser.id });
                    return { statusCode: 201, message: "User Signin Successfully", user: chekUser, token };
                }
                else {
                    return { statusCode: 403, message: "Incorrect Password" };
                }
            }
            else {
                return { statusCode: 403, message: "User With Email Does Not Exists" };
            }
        }
        catch (error) {
            console.log("error", error);
            throw new common_1.InternalServerErrorException();
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map