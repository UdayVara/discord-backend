import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { createChannelDto } from './dto/createchannel.dto';
import { updateChannelDto } from './dto/updatechannel.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/Guards/auth/auth.guard';

@ApiTags("Channel")
@UseGuards(AuthGuard)
@ApiBearerAuth("JWT-auth")
@Controller('channel')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post("")
  async create(
    @Body() createChanneldto: createChannelDto,
    @Req() req,
  ) {
    return this.channelsService.create(createChanneldto,req?.user?.id)
  }

  @Get(":id")
  findAll(@Req() req,@Param("id",new ParseUUIDPipe()) serverId) {
    return this.channelsService.findAll(req.user.id,serverId);
  }

  @Get('/get/:id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.channelsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: updateChannelDto,
    @Req() req,
  ) {
    return this.channelsService.update(
      id,
      data,
      req.user.id,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.channelsService.remove(id, req.user.id);
  }
}
