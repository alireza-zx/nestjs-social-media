import { Expose, Type } from "class-transformer";
import { PostResponseDto } from "../../posts/dtos/post-response.dto";
import { UserResponseDto } from "../../users/dtos/user-response.dto";

export class LikeResponseDto {
  @Expose()
  id: string;
  @Expose()
  @Type(() => PostResponseDto)
  post: PostResponseDto;
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
  @Expose()
  createdAt: Date;
}