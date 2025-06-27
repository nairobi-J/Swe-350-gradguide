export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  error?: string;
}