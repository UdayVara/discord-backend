import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from './common/common/common.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    JwtModule.register({
      global:true,
      secret:process.env.JWT_SECRET,
      signOptions:{
        expiresIn:"24h"
      }
    }),CommonModule,AuthModule
  ],
  controllers: [AppController],
  providers: [AppService,CommonModule],
  exports:[CommonModule]
})
export class AppModule {}
