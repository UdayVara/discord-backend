import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { ChatService } from 'src/chat/chat.service';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService,ChatService],
})
export class ChannelsModule {}
