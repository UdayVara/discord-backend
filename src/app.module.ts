import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from './common/common/common.module';
import { AuthModule } from './auth/auth.module';
import { ServerModule } from './server/server.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '24h',
      },
    }),
    CommonModule,
    AuthModule,
    ServerModule,
    ChannelsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CommonModule],
  exports: [CommonModule],
})
export class AppModule {}
