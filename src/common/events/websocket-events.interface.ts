import { Message } from "src/messages/message.entity";
import { Notification } from "src/notifications/notification.entity";

export enum ServerEventNames {
  NEW_MESSAGE = 'server:new_message',
  DELETE_MESSAGE = 'server:delete_message',
  UPDATE_MESSAGE = 'server:update_message',
  NEW_NOTIFICATION = 'server:new_notification'
}

export enum ClientEventNames {

}

interface ServerEventPayloads {
  NEW_MESSAGE: ServerNewMessagePayload,
  DELETE_MESSAGE: string,
  UPDATE_MESSAGE: ServerUpdateMessagePayload,
  NEW_NOTIFICATION: Notification
}

interface ClientEventPayloads {

}

export interface EventsPayloadsMap {
  [ServerEventNames.NEW_MESSAGE]: ServerEventPayloads['NEW_MESSAGE'],
  [ServerEventNames.DELETE_MESSAGE]: ServerEventPayloads['DELETE_MESSAGE'],
  [ServerEventNames.UPDATE_MESSAGE]: ServerEventPayloads['UPDATE_MESSAGE'],
  [ServerEventNames.NEW_NOTIFICATION]: ServerEventPayloads['NEW_NOTIFICATION']
}

// payloads

interface ServerNewMessagePayload {
  message: Message
}
interface ServerUpdateMessagePayload {
  messageId: string,
  updatedMessage: Message
}