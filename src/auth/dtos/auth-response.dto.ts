import { Expose, Type } from "class-transformer";
import { SessionResponseDto } from "../../sessions/dtos/session-response.dto";
import { UserResponseDto } from "../../users/dtos/user-response.dto";

export class AuthResponseDto {
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
  @Expose()
  @Type(() => SessionResponseDto)
  session: SessionResponseDto;
  @Expose()
  message: string;
  @Expose()
  accessToken: string;
}