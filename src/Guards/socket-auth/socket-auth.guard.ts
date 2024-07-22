import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
// import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = this.extractTokenFromHandshake(client);
    // console.log("token",token)
    if (!token) {
      throw new WsException("Unauthorized User")
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      console.log(payload,"Paylod")
      client.handshake.headers['user'] = payload;
    } catch {
      throw new WsException("Unauthorized User")
    }

    return true;
  }

  private extractTokenFromHandshake(client: Socket): string | undefined {
    // console.log("headers",client.handshake.auth.token)
    const token = client.handshake.auth.token;
    // console.log("Raw Token",token)
    return token?.replace('Bearer ', '');
  }
}
