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
      },
      {
        id: "1-2",
        role: "assistant",
        content: "RWA stands for Real-World Asset...",
        timestamp: now - 80000000,
      },
    ],
    timestamp: now - 200000,
  },
];

const initialMintedHistory: MintedInfo[] = [
  {
    id: "market-demo-1",
    conversationId: "1",
    messageIds: ["1-1", "1-2"],
    metadataUrl: "ipfs://QmDemo1...",
    reward: 50,
    timestamp: now - 1000000,

    ownerAddress: "0xMarketBot001",
    isListed: true,
    price: 0.05,
    listingId: "8888",
  },
  {
    id: "market-demo-2",
    conversationId: "1",
    messageIds: ["1-1"],
    metadataUrl: "ipfs://QmDemo2...",
    reward: 20,
    timestamp: now - 2000000,

    ownerAddress: "0xMarketBot002",
    isListed: true,
    price: 0.1,
    listingId: "9999",
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

export const userAddressAtom = atom<`0x${string}` | null>(null);
export const isWalletConnectedAtom = atom((get) => !!get(userAddressAtom));
export const isMintingAtom = atom(false);
