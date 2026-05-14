import { registerAs } from "@nestjs/config";

export const jwtConfig = registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTtl: process.env.JWT_ACCESS_TTL,
  refreshTtl: process.env.JWT_REFRESH_TTL,
  refreshTtlMs: parseInt(process.env.JWT_REFRESH_TTL_MS as string),
  hashTokenSalt: process.env.JWT_HASH_SALT
}));