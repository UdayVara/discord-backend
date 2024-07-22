import { IsString } from 'class-validator';

export class JoinChatDto {
  @IsString()
  channelId: string;
}
