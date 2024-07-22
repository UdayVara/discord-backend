import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException)
export class CustomWsExceptionFilter implements WsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client: Socket = ctx.getClient<Socket>();
    // const data = ctx.getData();
    
    const errorResponse = {
      status: 'error',
      message: exception.message,
    //   data,
    };
    // console.debug("Inside Socket Error Filter ")
    client.emit('error', errorResponse);
  }
}
