import { Message } from "@/model/User";

export interface ApiResponse<T = null>{
    success: boolean;
    message: string;
    data : T
}
export interface AcceptMessagesData {
  isAcceptingMessages: boolean
}
export interface MessagesData {
  messages: Message[]
}
