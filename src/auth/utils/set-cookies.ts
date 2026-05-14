import { type Response } from 'express';

export function setCookies(
  res: Response,
  accessToken: string,
  refreshToken?: string,
) {
  res.cookie('accessToken', accessToken, {
    maxAge: parseInt(process.env.COOKIE_MAXAGE_ACCESS as string),
    sameSite: process.env.COOKIE_SAMESITE === 'true' ? true : false,
    httpOnly: process.env.COOKIE_HTTPONLY === 'true' ? true : false,
    secure: process.env.COOKIE_SECURE === 'true' ? true : false,
  });
  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      maxAge: parseInt(process.env.COOKIE_MAXAGE_REFRESH as string),
      sameSite: process.env.COOKIE_SAMESITE === 'true' ? true : false,
      httpOnly: process.env.COOKIE_HTTPONLY === 'true' ? true : false,
      secure: process.env.COOKIE_SECURE === 'true' ? true : false,
    });
  }
}
