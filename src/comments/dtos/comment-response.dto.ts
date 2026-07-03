import { Expose, Type } from "class-transformer";
import { CommentLikeResponseDto } from "../../comment-likes/dtos/comment-like-response.dto";
import { PostResponseDto } from "../../posts/dtos/post-response.dto";
import { UserResponseDto } from "../../users/dtos/user-response.dto";

export class CommentResponseDto {
  @Expose()
  id: string;
  @Expose()
  content: string;
  @Expose()
  createdAt: Date;
  @Expose()
  @Type(() => PostResponseDto)
  post: PostResponseDto;
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
  @Expose()
  likesCount: number;
  @Expose()
  @Type(() => CommentLikeResponseDto)
  likes: CommentLikeResponseDto[];
  @Expose()
  message: string;
}