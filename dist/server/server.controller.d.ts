import { ServerService } from './server.service';
import { CreateServerDto } from './dto/create-server.dto';
import { updateServerDto } from './dto/update-server.dto';
import { SetRoleDto } from './dto/set-role.dto';
export declare class ServerController {
    private readonly serverService;
    constructor(serverService: ServerService);
    create(createServerDto: CreateServerDto, req: any, file: Express.Multer.File): Promise<{
        statusCode: number;
        message: string;
        messaage?: undefined;
        server?: undefined;
    } | {
        statusCode: number;
        messaage: string;
        server: {
            id: string;
            name: string;
            userId: string;
            serverImage: string | null;
            created_at: Date;
            updated_at: Date;
        };
        message?: undefined;
    }>;
    findAll(req: any): Promise<{
        statusCode: number;
        message: string;
        servers: {
            id: string;
            name: string;
            userId: string;
            serverImage: string | null;
            created_at: Date;
            updated_at: Date;
        }[];
    }>;
    findOne(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
        server: {
            id: string;
            name: string;
            userId: string;
            serverImage: string | null;
            created_at: Date;
            updated_at: Date;
        };
    } | {
        statusCode: number;
        message: string;
        server?: undefined;
    }>;
    update(id: string, data: updateServerDto, File: Express.Multer.File, req: any): Promise<{
        statusCode: number;
        message: string;
    }>;
    remove(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
    }>;
    joinServer(serverId: any, req: any): Promise<{
        statusCode: number;
        message: string;
    }>;
    leaveServer(serverId: any, req: any): Promise<{
        statusCode: number;
        message: string;
    }>;
    getRole(serverId: any, req: any): Promise<{
        statusCode: number;
        message: string;
        role: import(".prisma/client").$Enums.RoleType;
    }>;
    setRole(data: SetRoleDto, req: any): Promise<{
        statusCode: number;
        message: string;
    }>;
    getMembers(serverId: any, req: any): Promise<{
        statusCode: number;
        message: string;
        members: any[];
    }>;
}
