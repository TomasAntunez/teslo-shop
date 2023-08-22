import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const RawHeaders = createParamDecorator(
  ( _data, ctx: ExecutionContext ) => {
    return ctx.switchToHttp().getRequest().rawHeaders;
  }
);
