import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ServerService } from './server.service';
import { CreateServerDto } from './dto/create-server.dto';
import { updateServerDto } from './dto/update-server.dto';
import { AuthGuard } from 'src/Guards/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SetRoleDto } from './dto/set-role.dto';
import {v2 as cloudinary} from "cloudinary"
import { Readable } from 'stream';
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@ApiTags('Server')
@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createServerDto: CreateServerDto,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    cloudinary.config({
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret:process.env.CLOUDINARY_API_SECRET,
      cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
      secure:true
    })
    const stream = Readable.from(file.buffer);
    const upload_result: any = await new Promise((resolve, reject) => {
      const streamLoad = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'discord-clone' },
        (err, result) => {
          if (err) {
            console.log(err);
            return reject(err);
          }
          resolve(result);
        },
      );
      stream.pipe(streamLoad);
    });
    return this.serverService.create(
      createServerDto,
      req.user.id,
      upload_result?.secure_url || '',
    );
  }

  @Get()
  findAll(@Req() req) {
    return this.serverService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.serverService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      // dest: 'public/server-images',
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, 'public/server-images');
        },
        filename(req: any, file, callback) {
          callback(null, req.user.id + file.originalname);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() data: updateServerDto,
    @UploadedFile() File: Express.Multer.File,
    @Req() req,
  ) {
    return this.serverService.update(
      id,
      data,
      File.originalname || '',
      req.user.id,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.serverService.remove(id, req.user.id);
  }

  @Post('join/:id')
  joinServer(@Param('id') serverId, @Req() req) {
    return this.serverService.joinServer(serverId, req.user.id);
  }

  @Delete('leave/:id')
  leaveServer(@Param('id') serverId, @Req() req) {
    return this.serverService.leaveServer(serverId, req.user.id);
  }

  @Get('role/:id')
  getRole(@Param('id') serverId, @Req() req) {
    return this.serverService.getRole(serverId, req.user.id);
  }

  @Patch('role/set')
  setRole(@Body() data: SetRoleDto, @Req() req) {
    return this.serverService.setRole(data, req.user.id);
  }

  @Get('members/:id')
  getMembers(@Param('id') serverId, @Req() req) {
    return this.serverService.getMembers(serverId, req.user.id);
  }
}
