import { InternalServerErrorException } from '@nestjs/common';
import { signupdto } from './dto/signup.dto';
import { PrismaService } from 'src/common/services/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { signindto } from './dto/signin.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    signup(credentials: signupdto): Promise<InternalServerErrorException | {
        statusCode: number;
        message: string;
        token?: undefined;
        user?: undefined;
    } | {
        statusCode: number;
        message: string;
        token: string;
        user: {
            id: string;
            username: string;
            email: string;
            password: string;
            created_at: Date;
            updated_at: Date;
            socketId: string | null;
        };
    }>;
    signin(credentials: signindto): Promise<{
        statusCode: number;
        message: string;
        user: {
            id: string;
            username: string;
            email: string;
            password: string;
            created_at: Date;
            updated_at: Date;
            socketId: string | null;
        };
        token: string;
    } | {
        statusCode: number;
        message: string;
        user?: undefined;
        token?: undefined;
    }>;
}
