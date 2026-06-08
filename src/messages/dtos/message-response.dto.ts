import { Expose, Type } from "class-transformer";
import { ConversationResponseDto } from "../../conversations/dtos/conversation-response.dto";
import { UserResponseDto } from "../../users/dtos/user-response.dto";

export class MessageResponseDto {
  @Expose()
  id: string;
  @Expose()
  @Type(() => UserResponseDto)
  sender: UserResponseDto;
  @Expose()
  @Type(() => ConversationResponseDto)
  conversation: ConversationResponseDto;
  @Expose()
  content: string;
  @Expose()
  seen: boolean;
  @Expose()
  createdAt: Date;
}