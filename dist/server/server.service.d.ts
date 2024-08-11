import { CreateServerDto } from './dto/create-server.dto';
import { updateServerDto } from './dto/update-server.dto';
import { PrismaService } from 'src/common/services/prisma.service';
import { SetRoleDto } from './dto/set-role.dto';
export declare class ServerService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createServerDto: CreateServerDto, userId: string, image: string): Promise<{
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
    findAll(userId: string): Promise<{
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
    findOne(id: string, userId: string): Promise<{
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
    update(id: string, updateServerDto: updateServerDto, image: string, userId: string): Promise<{
        statusCode: number;
        message: string;
    }>;
    remove(id: string, userId: string): Promise<{
        statusCode: number;
        message: string;
    }>;
    joinServer(serverId: string, userId: string): Promise<{
        statusCode: number;
        message: string;
    }>;
    leaveServer(serverId: string, userId: string): Promise<{
        statusCode: number;
        message: string;
    }>;
    getRole(serverId: string, userId: string): Promise<{
        statusCode: number;
        message: string;
        role: import(".prisma/client").$Enums.RoleType;
    }>;
    setRole(setRole: SetRoleDto, userId: string): Promise<{
        statusCode: number;
        message: string;
    }>;
    getMembers(serverId: string, userId: string): Promise<{
        statusCode: number;
        message: string;
        members: any[];
    }>;
}
