
export interface ChatUser {
  id: string;
  name: string | null;
  picture: string | null;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
  sender: ChatUser;
}

export interface Conversation {
  id: string;
  bidId: string;
  jobId: string;
  clientId: string;
  freelancerId: string;
  createdAt: string;
  updatedAt: string;

  job: {
    id: string;
    title: string;
  };

  client: ChatUser;
  freelancer: ChatUser;

  messages: ChatMessage[];
}
