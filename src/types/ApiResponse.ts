import { Message } from "@/model/User";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingFeedback?: boolean;
    messages?: Array<Message>;
}
