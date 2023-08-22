import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "src/users/entities/user.entity";

import { JwtPayload } from "../interfaces/jwt-payload.interface";


@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }


  async validate({ id }: JwtPayload): Promise<User> {

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }

    if ( !user.isActive ) {
      throw new UnauthorizedException('User is not active, talk with an admin');
    }

    return user;
  }

}
