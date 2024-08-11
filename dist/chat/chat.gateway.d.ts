import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { JoinChatDto } from './dto/join-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    constructor(chatService: ChatService);
    server: Server;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    hey(client: Socket, message: string): {
        statusCode: number;
        message: string;
    };
    joinRoom(socket: Socket, joinChatDto: JoinChatDto): Promise<void>;
    sendMessage(socket: Socket, sendMessageDto: SendMessageDto): Promise<void>;
    findAll(): void;
}
