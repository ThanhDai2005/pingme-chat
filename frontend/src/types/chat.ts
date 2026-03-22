export interface Participant {
  userId: {
    _id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
  joinAt: string;
}

export interface SeenBy {
  _id: string;
  displayName?: string;
  avatarUrl?: string | null;
}

export interface Group {
  name: string;
  createdBy: string;
}

export interface LastMessage {
  messageId?: string;
  type: "text" | "file";
  content: string | null;
  senderId: {
    _id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
  createdAt: string | null;
}

export interface Conversation {
  _id: string;
  type: "direct" | "group";
  group?: Group;
  participants: Participant[];
  lastMessageAt: string;
  seenBy: SeenBy[];
  lastMessage: LastMessage | null;
  unreadCounts: Record<string, number>; // key = userId, value = unread count
  createdAt: string;
  updatedAt: string;
}

export interface MessageImage {
  url: string;
  fileType: string;
  name: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  imgUrl?: MessageImage[];
  updatedAt?: string | null;
  createdAt: string;
  isOwn?: boolean;
}
