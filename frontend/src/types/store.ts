import type { Socket } from "socket.io-client";
import type { Conversation, Message } from "./chat";
import type { Friend, FriendRequest, User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  clearState: () => void;
  signUp: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getDetail: () => Promise<void>;
  refresh: () => Promise<void>;
}

export interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

export interface ChatState {
  conversations: Conversation[];
  messages: Record<
    string,
    {
      items: Message[];
      hasMore: boolean; // infinite-scroll
      nextCursor?: string | null; // phân trang
    }
  >;
  activeConversationId: string | null;
  convoLoading: boolean;
  messageLoading: boolean;
  loading: boolean;
  reset: () => void;

  setActiveConversation: (id: string | null) => void;
  getListConversation: () => Promise<void>;
  getMessages: (conversationId?: string) => Promise<void>;
  sendDirectMessage: (
    recipientId: string,
    content: string,
    imgUrl?: string[],
  ) => Promise<void>;
  sendGroupMessage: (
    conversationId: string,
    content: string,
    imgUrl?: string[],
  ) => Promise<void>;
  addMessage: (message: Message) => Promise<void>;
  updateConversation: (conversation: unknown) => void;
  markAsSeen: () => Promise<void>;
  addConvo: (conversation: Conversation) => void;
  createConversation: (
    type: string,
    name: string,
    memberIds: string[],
  ) => Promise<void>;
}

export interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  setOnlineUsers: (onlineUsers: string[]) => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export interface FriendState {
  receiveList: FriendRequest[];
  sendList: FriendRequest[];
  friendList: Friend[];
  loading: boolean;
  searchUser: (username: string) => Promise<User | null>;
  sendFriendRequest: (to: string, message?: string) => Promise<string>;
  cancelFriendRequest: (requestId: string) => Promise<void>;
  getFriendRequest: () => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
  getAllFriends: () => Promise<void>;
}

export interface UserState {
  uploadAvatar: (formData: FormData) => Promise<void>;
  updateInfo: (
    displayName: string,
    username: string,
    email: string,
    phone?: string,
    bio?: string,
  ) => Promise<void>;
}
