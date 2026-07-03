import { Expose, Type } from "class-transformer";
import { CommentResponseDto } from "../../comments/dtos/comment-response.dto";
import { UserResponseDto } from "../../users/dtos/user-response.dto";

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