import { PrismaService } from 'src/common/services/prisma.service';
import { createChannelDto } from './dto/createchannel.dto';
import { updateChannelDto } from './dto/updatechannel.dto';
import { ChatService } from 'src/chat/chat.service';
export declare class ChannelsService {
    private prisma;
    private readonly chatService;
    constructor(prisma: PrismaService, chatService: ChatService);
    create(createChanneldto: createChannelDto, userId: string): Promise<{
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
            serverId: string;
            type: import(".prisma/client").$Enums.ChannelType;
            userId: string;
            created_at: Date;
            updated_at: Date;
        };
        message?: undefined;
    }>;
    findAll(userId: string, serverId: string): Promise<{
        statusCode: number;
        message: string;
        textChannels: any;
        audioChannels: any;
        videoChannels: any;
    }>;
    findOne(id: string, userId: string): Promise<{
        statusCode: number;
        message: string;
        channel: {
            id: string;
            name: string;
            serverId: string;
            type: import(".prisma/client").$Enums.ChannelType;
            userId: string;
            created_at: Date;
            updated_at: Date;
        };
    } | {
        statusCode: number;
        message: string;
        channel?: undefined;
    }>;
    update(id: string, updateChanneldto: updateChannelDto, userId: string): Promise<{
        statusCode: number;
        message: string;
    }>;
    remove(id: string, userId: string): Promise<{
        statusCode: number;
        message: string;
    }>;
    search(query: string, serverId: any): Promise<{
        statusCode: number;
        message: string;
        textChannels: any;
        audioChannels: any;
        videoChannels: any;
        members: {
            id: string;
            userId: string;
            role: import(".prisma/client").$Enums.RoleType;
            serverId: string | null;
            created_at: Date;
            updated_at: Date;
        }[];
    }>;
}
