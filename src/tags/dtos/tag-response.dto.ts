import { Expose } from "class-transformer";

export class TagResponseDto {
  @Expose()
  id: string;
  @Expose()
  title: string;
  @Expose()
  slug: string;
  @Expose()
  createdAt: Date;
  @Expose()
  postsCount: number;
}