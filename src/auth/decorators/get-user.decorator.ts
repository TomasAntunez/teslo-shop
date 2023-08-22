import {
  ExecutionContext, InternalServerErrorException, createParamDecorator
} from "@nestjs/common";

export const GetUser = createParamDecorator(
  ( userProperty: string, context: ExecutionContext ) => {

    const { user } = context.switchToHttp().getRequest();

    if (!user) throw new InternalServerErrorException('User not fount (request)');

    return userProperty ? user[userProperty] : user;
  }
);
