import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { type Request } from "express";
import { JwtAccessService } from "../jwt/access/jwt.access.service";
import { UsersService } from "../../users/users.service";

@Injectable()
export class CookieAuthGuard implements CanActivate {
  constructor(
    // Inject JwtAccessService
    private readonly jwtAccessService: JwtAccessService,
    // Inject UsersService
    private readonly usersService: UsersService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const { accessToken } = req.cookies;

    if (!accessToken)
      throw new UnauthorizedException();

    const payload = await this.jwtAccessService.verifyToken(accessToken);

    const user = await this.usersService.findOneUserById(payload.sub);
    
    // check if user's password has changed after the token was issued
    if ((user.passwordLastChanged.getTime() / 1000) - 1 > payload.iat)
      throw new UnauthorizedException('User has recently changed their password');

    req.user = user;
    return true;
  }
}