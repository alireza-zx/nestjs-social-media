import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AUTH_NONE, AUTH_TYPE_KEY } from "../constants/meta-data.consts";
import { CookieAuthGuard } from "./cookieAuth.guard";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    // Inject Reflector (for getting metadata of the particular endpoint function)
    private readonly reflector: Reflector,
    // Inject CookieAuthGuard
    private readonly cookieAuthGuard: CookieAuthGuard
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // getting metadata of auth type from particular endpoint handler function
    const authTypesMetaData = 
      this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [context.getHandler(), context.getClass()]) ?? 'COOKIE';

    if (authTypesMetaData === AUTH_NONE)
      return true;

    return await this.cookieAuthGuard.canActivate(context);
  }
}