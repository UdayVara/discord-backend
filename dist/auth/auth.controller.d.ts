import { AuthService } from './auth.service';
import { signupdto } from './dto/signup.dto';
import { signindto } from './dto/signin.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signup: signupdto): Promise<import("@nestjs/common").InternalServerErrorException | {
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
    signin(signin: signindto): Promise<{
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
