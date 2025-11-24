import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type {
  Conversation,
  HeaderConfig,
  MintedInfo,
  Transaction,
} from "../types";

const now = Date.now();

export const isMobileInputFocusedAtom = atom(false);

const initialConversations: Conversation[] = [
  {
    id: "1",
    title: "Exploring RWA",
    messages: [
      {
        id: "1-1",
        role: "user",
        content: "What is RWA?",
        timestamp: now - 90000000,
        isMinted: true,
      },
      {
        id: "1-2",
        role: "assistant",
        content: "RWA stands for Real-World Asset...",
        timestamp: now - 80000000,
        isMinted: true,
      },
    ],
    timestamp: now - 200000,
  },
  {
    id: "2",
    title: "Future of AI",
    messages: [
      {
        id: "2-1",
        role: "user",
        content: "What is the future of AI?",
        timestamp: now - 50000,
      },
      {
        id: "2-2",
        role: "assistant",
        content: "The future of AI is vast...",
        timestamp: now - 40000,
      },
    ],
    timestamp: now - 50000,
  },
  {
    id: "market-1",
    title: "DeFi Trading Strategies",
    messages: [
      {
        id: "m1-1",
        role: "user",
        content: "Explain yield farming.",
        timestamp: now - 300000,
      },
      {
        id: "m1-2",
        role: "assistant",
        content: "Yield farming involves lending crypto...",
        timestamp: now - 290000,
      },
    ],
    timestamp: now - 300000,
  },
  {
    id: "market-2",
    title: "Ethereum Layer 2",
    messages: [
      {
        id: "m2-1",
        role: "user",
        content: "Why do we need L2?",
        timestamp: now - 400000,
      },
      {
        id: "m2-2",
        role: "assistant",
        content: "Layer 2 solutions improve scalability...",
        timestamp: now - 390000,
      },
    ],
    timestamp: now - 400000,
  },
];

const initialMintedHistory: MintedInfo[] = [
  {
    id: "mint-1",
    conversationId: "1",
    messageIds: ["1-1", "1-2"],
    metadataUrl: "ipfs://QmMyAsset...",
    reward: 125.5,
    timestamp: Date.now() - 90000,
    price: 0,
    isListed: false,
    ownerAddress: "0x123...mock",
  },

  {
    id: "mint-market-1",
    conversationId: "market-1",
    messageIds: ["m1-1", "m1-2"],
    metadataUrl: "ipfs://QmMarket1...",
    reward: 80.0,
    timestamp: Date.now() - 200000,
    price: 50,
    isListed: true,
    ownerAddress: "0xOtherUserA",
  },
  {
    id: "mint-market-2",
    conversationId: "market-2",
    messageIds: ["m2-1", "m2-2"],
    metadataUrl: "ipfs://QmMarket2...",
    reward: 200.0,
    timestamp: Date.now() - 300000,
    price: 120,
    isListed: true,
    ownerAddress: "0xOtherUserB",
  },
];

export const conversationsAtom = atomWithStorage<Conversation[]>(
  "chat_conversations",
  initialConversations
);

export const activeConversationIdAtom = atom<string | null>(null);
export const selectedMessageIdsAtom = atom<Set<string>>(new Set<string>());
export const activeConversationAtom = atom<Conversation | undefined>((get) => {
  const conversations = get(conversationsAtom);
  const activeId = get(activeConversationIdAtom);
  return conversations.find((c) => c.id === activeId);
});
export const mintedHistoryAtom = atomWithStorage<MintedInfo[]>(
  "chat_minted_history",
  initialMintedHistory
);
export const transactionsAtom = atomWithStorage<Transaction[]>(
  "chat_transactions",
  []
);
export const totalRewardsAtom = atom<number>(0);
export const mobileHistoryOpenAtom = atom(false);
export const headerConfigAtom = atom<HeaderConfig>({
  title: "Chat as Assets",
  rightAction: null,
});
export const userAddressAtom = atom<string | null>(null);
export const isWalletConnectedAtom = atom((get) => !!get(userAddressAtom));
export const isMintingAtom = atom(false);
