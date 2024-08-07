import { IsBoolean, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  channelId: string;

  @IsString()
  message:string;

  @IsBoolean()
  isPersonal:boolean;

  file:any
}
