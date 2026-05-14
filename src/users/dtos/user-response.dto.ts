import { Exclude, Expose } from "class-transformer";

export class UserResponseDto {
  @Expose()
  id: string;
  @Expose()
  avatar: string;
  @Expose()
  firstname: string;
  @Expose()
  lastname?: string;
  @Expose()
  username: string;
  @Expose()
  region: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
  @Expose()
  followersCount: number;
  @Expose()
  followingsCount: number;
}