import { Expose, Type } from "class-transformer";
import { SessionResponseDto } from "src/sessions/dtos/session-response.dto";
import { UserResponseDto } from "src/users/dtos/user-response.dto";

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