import { registerAs } from "@nestjs/config";

export const appConfig = registerAs('app', () => ({
  corsOrigin: process.env.CORS_ORIGIN,
  apiVersion: process.env.API_VERSION,
  serverDomain: process.env.SERVER_DOMAIN,
  clientDomain: process.env.CLIENT_DOMAIN,
  mailHost: process.env.MAIL_HOST,
  mailPort: parseInt(process.env.MAIL_PORT as string),
  mailSecure: process.env.MAIL_SECURE === 'true' ? true : false,
  mailUsername: process.env.MAIL_USERNAME,
  mailPassword: process.env.MAIL_PASSWORD
}));