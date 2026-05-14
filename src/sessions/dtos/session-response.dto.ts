import { Expose } from "class-transformer";

export class SessionResponseDto {
  @Expose()
  id: string;
  @Expose()
  createdAt: Date;
  @Expose()
  expiresAt: Date;
}