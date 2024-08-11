import { JoinChatDto } from './dto/join-chat.dto';
import { PrismaService } from 'src/common/services/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
export declare class ChatService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(): string;
    setSocketId(socketId: string, user: string): Promise<boolean>;
    resetSocketId(userId: string): Promise<boolean>;
    joinRoom(joinChatDto: JoinChatDto): Promise<string>;
    findAll(isPersonal: boolean, senderId: string, channelId: string): Promise<{
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
    sendMessage(sendMessageDto: SendMessageDto, userId: string, file: any): Promise<{
        success: boolean;
        message: {
            user: {
                id: string;
                username: string;
                email: string;
                password: string;
                created_at: Date;
                updated_at: Date;
                socketId: string | null;
            };
            channel: {
                id: string;
                name: string;
                serverId: string;
                type: import(".prisma/client").$Enums.ChannelType;
                userId: string;
                created_at: Date;
                updated_at: Date;
            };
            receivers: {
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
        };
    } | {
        success: boolean;
        message?: undefined;
    }>;
    getAllServers(userId: string): Promise<any[]>;
}
