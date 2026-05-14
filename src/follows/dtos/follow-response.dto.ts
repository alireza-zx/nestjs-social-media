import { Expose, Type } from "class-transformer";
import { UserResponseDto } from "src/users/dtos/user-response.dto";

export class FollowResponseDto {
  @Expose()
  id: string;
  @Expose()
  @Type(() => UserResponseDto)
  following: UserResponseDto;
  @Expose()
  @Type(() => UserResponseDto)
  follower: UserResponseDto;
  @Expose()
  createdAt: Date;
  @Expose()
  message: string;
}