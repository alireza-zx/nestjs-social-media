import { Expose, Type } from "class-transformer";
import { CommentResponseDto } from "src/comments/dtos/comment-response.dto";
import { UserResponseDto } from "src/users/dtos/user-response.dto";

export class CommentLikeResponseDto {
  @Expose()
  id: string;
  @Expose()
  @Type(() => CommentResponseDto)
  comment: CommentResponseDto;
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}