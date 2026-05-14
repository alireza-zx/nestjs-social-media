import { registerAs } from "@nestjs/config";

export const cookiesConfig = registerAs('cookie', () => ({
  maxAgeAccess: parseInt(process.env.COOKIE_MAXAGE_ACCESS as string),
  maxAgeRefresh: parseInt(process.env.COOKIE_MAXAGE_REFRESH as string),
  httpOnly: process.env.COOKIE_HTTPONLY === 'true' ? true : false,
  secure: process.env.COOKIE_SECURE === 'true' ? true : false,
  sameSite: process.env.COOKIE_SAMESITE === 'true' ? true : false
}));