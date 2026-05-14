import { Expose, Type } from "class-transformer";
import { TagResponseDto } from "src/tags/dtos/tag-response.dto";
import { UserResponseDto } from "src/users/dtos/user-response.dto";

export class PostResponseDto {
  @Expose()
  id: string;
  @Expose()
  slug: string;
  @Expose()
  description: string;
  @Expose()
  type: string;
  @Expose()
  fileMimeType: string;
  @Expose()
  fileUrl: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
  @Expose()
  @Type(() => UserResponseDto)
  author: UserResponseDto;
  @Expose()
  commentsCount: number;
  @Expose()
  likesCount: number;
  @Expose()
  @Type(() => TagResponseDto)
  tags: TagResponseDto[];
}