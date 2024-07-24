import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  channelId: string;

  @IsString()
  message:string;


}
