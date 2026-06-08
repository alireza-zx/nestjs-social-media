import { Expose, Type } from "class-transformer";
import { UserResponseDto } from "../../users/dtos/user-response.dto";

export class UploadResponseDto {
  @Expose()
  id: string;
  @Expose()
  filename: string;
  @Expose()
  filePath: string;
  @Expose()
  fileMimeType: string;
  @Expose()
  postType: string;
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
  @Expose()
  createdAt: Date;
}