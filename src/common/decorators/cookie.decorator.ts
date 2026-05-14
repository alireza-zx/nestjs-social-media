import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { type Request } from "express";

export const Cookie = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const req: Request = context.switchToHttp().getRequest();
    return req.cookies;
  }
);