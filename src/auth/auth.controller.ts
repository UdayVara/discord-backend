import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupdto } from './dto/signup.dto';
import { signindto } from './dto/signin.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  // @UsePipes(new ValidationPipe({transform:true}))
  async signup(@Body() signup:signupdto){
    console.log("Request received")
    return await this.authService.signup(signup)
  }

  @Post("signin")
  async signin(@Body() signin:signindto){
    return this.authService.signin(signin)
  }
}
