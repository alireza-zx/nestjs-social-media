import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { Cookie } from '../common/decorators/cookie.decorator';
import { setCookies } from './utils/set-cookies';
import { Auth } from '../common/decorators/auth.decorator';
import { AUTH_NONE } from './constants/meta-data.consts';
import { clearCookies } from './utils/clear-cookies';
import { type Request, type Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../common/decorators/response-serializer.decorator';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { VerificationCodeQueryDto } from './dtos/verification-code-query.dto';
import { Throttle } from '@nestjs/throttler';
import { ForgetPasswordDto } from './dtos/forget-password.dto';

@Controller('auth')
@Serialize(AuthResponseDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @Auth(AUTH_NONE)
  public async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
    @Query() query: VerificationCodeQueryDto
  ) {
    const result = await this.authService.signup(createUserDto, query.verificationCode);
    setCookies(res, result.accessToken, result.refreshToken);

    return {
      user: result.user,
      session: result.session.savedSession,
    };
  }

  @Post('/sign-in')
  @Auth(AUTH_NONE)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  public async signin(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
    @Cookie() cookies
  ) {
    if (cookies.refreshToken) {
      const { user, accessToken, refreshToken, savedSession } = await this.authService.signinAgain(signInDto, cookies.refreshToken);
      setCookies(res, accessToken, refreshToken);
      return {
        user,
        session: savedSession,
      };
    }
    const {user, accessToken, refreshToken, savedSession } = await this.authService.signin(signInDto);
    setCookies(res, accessToken, refreshToken);
    return {
      user,
      session: savedSession,
    };
  }

  @Get('/refresh')
  @Auth(AUTH_NONE)
  public async refresh(
    @Res({ passthrough: true }) res: Response,
    @Cookie() cookies
  ) {
    if (!cookies.refreshToken)
      throw new UnauthorizedException();

    const accessToken = await this.authService.refresh(cookies.refreshToken);
    setCookies(res, accessToken);
    return {
      message: 'successfully refreshed',
      accessToken
    }
  }

  @Post('/forget-password')
  @Throttle({ default: { limit: 1, ttl: 300000 } })
  @Auth(AUTH_NONE)
  public async forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto
  ) {
    return this.authService.
  }


  @Delete('/sign-out')
  @HttpCode(HttpStatus.OK)
  public async signout(
    @Res({ passthrough: true }) res: Response,
    @Cookie() cookies,
    @CurrentUser() user: User
  ) {
    await this.authService.signout(cookies.refreshToken, user);
    clearCookies(res, 'accessToken', 'refreshToken');
    return {
      message: 'successfully signed out',
    };
  }

  @Delete('/sign-out-all')
  @HttpCode(HttpStatus.OK)
  public async signoutAll(@Cookie() cookies, @CurrentUser() user: User) {
    await this.authService.signoutAll(cookies.refreshToken, user);
    return {
      message: 'all other sessions signed out successfully'
    }
  }
}