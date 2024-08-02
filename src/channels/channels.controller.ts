import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { createChannelDto } from './dto/createchannel.dto';
import { updateChannelDto } from './dto/updatechannel.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/Guards/auth/auth.guard';
import { ChatService } from 'src/chat/chat.service';

@ApiTags('Channel')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('channel')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService,private readonly chatService:ChatService) {}

  @Post('')
  async create(@Body() createChanneldto: createChannelDto, @Req() req) {
    return this.channelsService.create(createChanneldto, req?.user?.id);
  }

  @Get(':id')
  findAll(@Req() req, @Param('id', new ParseUUIDPipe()) serverId) {
    return this.channelsService.findAll(req.user.id, serverId);
  }

  @Get('/get/:id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.channelsService.findOne(id, req.user.id);
  }

  @Get('/search/:id')
  search(
    @Param('id') serverId: string,
    @Query('query') query: string,
  ) {
    return this.channelsService.search(query, serverId);
  }
  @Get('/chats/:id')
  async getChats(
    @Param('id') channelId: string,
    @Query("isPersonal") isPesonal:boolean,
    @Req() req,
  ) {
    // console.log("chats Request called for channel id" + channelId)
    return await this.chatService.findAll(isPesonal,req?.user.id,channelId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: updateChannelDto, @Req() req) {
    return this.channelsService.update(id, data, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.channelsService.remove(id, req.user.id);
  }
}
