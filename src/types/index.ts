import type { ReactNode } from "react";

export interface ChatMessage {
  id: string;
  role: string;
  content: string;
  timestamp: number;
  isMinted?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
}

export interface MintedInfo {
  id: string;
  conversationId: string;
  messageIds: string[];
  metadataUrl: string;
  reward: number;
  timestamp: number;
}

export interface HeaderConfig {
  title: ReactNode;
  rightAction: ReactNode | null;
}
