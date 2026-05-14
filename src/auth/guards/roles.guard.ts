import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE_KEY } from "../constants/meta-data.consts";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    // Inject reflector
    private readonly reflector: Reflector
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const allowedRoles = this.reflector.getAllAndOverride(ROLE_KEY, [context.getHandler(), context.getClass()]);
    
    if (!allowedRoles)
      return true;

    if (allowedRoles.includes(req.user.role))
      return true;

    return false;
  }
}