import { ChannelsService } from './channels.service';
import { createChannelDto } from './dto/createchannel.dto';
import { updateChannelDto } from './dto/updatechannel.dto';
import { ChatService } from 'src/chat/chat.service';
export declare class ChannelsController {
    private readonly channelsService;
    private readonly chatService;
    constructor(channelsService: ChannelsService, chatService: ChatService);
    create(createChanneldto: createChannelDto, req: any): Promise<{
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
    findAll(req: any, serverId: any): Promise<{
        statusCode: number;
        message: string;
        textChannels: any;
        audioChannels: any;
        videoChannels: any;
    }>;
    findOne(id: string, req: any): Promise<{
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
    search(serverId: string, query: string): Promise<{
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
    getChats(channelId: string, isPesonal: boolean, req: any): Promise<{
        statusCode: number;
        message: string;
        chats: ({
            user: {
                id: string;
                username: string;
                email: string;
                password: string;
                created_at: Date;
                updated_at: Date;
                socketId: string | null;
            };
        } & {
            id: string;
            userId: string;
            message: string;
            fileurl: string | null;
            isEdited: boolean;
            isDeleted: boolean;
            created_at: Date;
            updated_at: Date;
            channelId: string | null;
            receiverId: string | null;
        })[];
    }>;
    update(id: string, data: updateChannelDto, req: any): Promise<{
        statusCode: number;
        message: string;
    }>;
    remove(id: string, req: any): Promise<{
        statusCode: number;
        message: string;
    }>;
}
