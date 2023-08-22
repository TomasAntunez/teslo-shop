import {
  BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';

import { RegisterUserDto, LoginUserDto } from './dto';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly encryptionService: BcryptAdapter,

    private readonly jwtService: JwtService
  ) {}


  async register(createUserDto: RegisterUserDto) {
    try {
      const { password, ...userRest } = createUserDto;

      const user = this.userRepository.create({
        ...userRest,
        password: this.encryptionService.hashSync(password)
      });

      await this.userRepository.save( user );
      delete user.password;
  
      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };

    } catch (error) {
      this.handleDBErrors(error);
    }
  }


  async login( { email, password }: LoginUserDto ) {

    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true }
    });

    if (!user) throw new UnauthorizedException('Credentials are not valid (email)');

    if ( !this.encryptionService.compareSync(password, user.password) ) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }

    delete user.password;

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }


  checkAuthStatus( user: User ) {
    delete user.roles;
    delete user.isActive;

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }


  private getJwtToken( payload: JwtPayload ) {
    return this.jwtService.sign(payload);
  }


  private handleDBErrors( error: any ): never {
    if ( error.code === '23505' ) {
      throw new BadRequestException( error.detail );
    }
    console.log(error);
    throw new InternalServerErrorException('Check server logs');
  }

}
