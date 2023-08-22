import {
  Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { RawHeaders } from 'src/common/decorators/raw-headers.decorator';
import { User } from 'src/users/entities/user.entity';

import { AuthService } from './auth.service';
import { RegisterUserDto, LoginUserDto } from './dto';
import { GetUser, RoleProtected, Auth } from './decorators';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces/valid-roles.enum';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}


  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode( HttpStatus.OK )
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('status')
  @Auth()
  checkAuthStatus( @GetUser() user: User ) {
    return this.authService.checkAuthStatus(user);
  }


  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') email: string,

    @RawHeaders() rawHeaders: string[]
  ) {
    console.log({ request });
    console.log({ rawHeaders });

    return { user, email, rawHeaders };
  }


  @Get('private2')
  // @SetMetadata('roles', ['admin', 'super-user'])
  @RoleProtected( ValidRoles.SUPER_USER, ValidRoles.ADMIN )
  @UseGuards( AuthGuard(), UserRoleGuard )
  testingPrivateRoute2(
    @GetUser() user: User,
  ) {
    return { user };
  }


  @Get('private3')
  @Auth( ValidRoles.ADMIN )
  testingPrivateRoute3( @GetUser() user: User ) {
    return user;
  }

}
