import { Reflector } from '@nestjs/core';
import {
  CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { User } from 'src/users/entities/user.entity';

import { ROLES } from '../decorators/role-protected.decorator';
import { ValidRoles } from '../interfaces/valid-roles.enum';


@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor( private readonly reflector: Reflector ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(ROLES, context.getHandler());
    if ( !validRoles || validRoles.length === 0 ) return true;

    const { user }: { user: User } = context.switchToHttp().getRequest();
    if (!user) throw new InternalServerErrorException('User not found');

    for (const role of user.roles) {
      if ( validRoles.includes(role) ) return true;
    }

    throw new ForbiddenException(`User ${user.fullName} need a valid role: [${ validRoles }]`);
  }
}
