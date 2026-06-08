import { Expose, Type } from "class-transformer";
import { MessageResponseDto } from "../../messages/dtos/message-response.dto";
import { UserResponseDto } from "../../users/dtos/user-response.dto";

export class ConversationResponseDto {
  @Expose()
  id: string;
  @Expose()
  @Type(() => MessageResponseDto)
  messages: MessageResponseDto[];
  @Expose()
  @Type(() => UserResponseDto)
  user1: UserResponseDto;
  @Expose()
  @Type(() => UserResponseDto)
  user2: UserResponseDto;
  @Expose()
  isGroup: boolean;
  @Expose()
  createdAt: Date;
}