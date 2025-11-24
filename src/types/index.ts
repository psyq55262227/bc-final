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
  // 市场相关字段
  price?: number;
  isListed?: boolean;
  ownerAddress?: string;
}

// 交易记录类型
export interface Transaction {
  id: string;
  assetId: string;
  sellerAddress: string;
  buyerAddress: string;
  price: number;
  timestamp: number;
}

export interface HeaderConfig {
  title: ReactNode;
  rightAction: ReactNode | null;
}
