import { registerAs } from "@nestjs/config";

export const databaseConfig = registerAs('database', () => ({
  type: process.env.DATABASE_TYPE,
  port: process.env.DATABASE_PORT,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PASS,
  name: process.env.DATABASE_NAME,
  sync: process.env.DATABASE_SYNC === 'true' ? true : false,
  auto: process.env.DATABASE_AUTOLOAD === 'true' ? true : false
}));