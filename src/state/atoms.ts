import { atom } from "jotai";
import type { Conversation, HeaderConfig, MintedInfo } from "../types";

const now = Date.now();

const initialConversations: Conversation[] = [
  {
    id: "1",
    title: "Exploring RWA",
    messages: [
      { role: "user", content: "What is RWA?", timestamp: now - 90000000 },
      {
        role: "assistant",
        content: "RWA stands for Real-World Asset...",
        timestamp: now - 80000000,
      },
      { role: "user", content: "Hello, who are you?", timestamp: now - 200000 },
      {
        role: "assistant",
        content: "I am an AI assistant.",
        timestamp: now - 190000,
      },
    ],
    timestamp: now - 200000,
    isMinted: true,
  },
  {
    id: "2",
    title: "Future of AI",
    messages: [
      {
        role: "user",
        content: "What is the future of AI?",
        timestamp: now - 50000,
      },
      {
        role: "assistant",
        content: "The future of AI is vast and transformative...",
        timestamp: now - 40000,
      },
    ],
    timestamp: now - 50000,
  },
].map(({ messages, ...props }) => ({
  ...props,
  messages: messages.map((msg, id) => ({ ...msg, id: id.toString() })),
}));

export const conversationsAtom = atom<Conversation[]>(initialConversations);

export const activeConversationIdAtom = atom<string | null>(null);

export const activeConversationAtom = atom<Conversation | undefined>((get) => {
  const conversations = get(conversationsAtom);
  const activeId = get(activeConversationIdAtom);
  return conversations.find((c) => c.id === activeId);
});

export const mintedHistoryAtom = atom<MintedInfo[]>([
  {
    conversationId: "1",
    metadataUrl: "ipfs://Qm...",
    reward: 125.5,
    timestamp: Date.now() - 90000,
  },
]);

export const totalRewardsAtom = atom<number>((get) =>
  get(mintedHistoryAtom).reduce((total, item) => total + item.reward, 0)
);

export const mobileHistoryOpenAtom = atom(false);

export const headerConfigAtom = atom<HeaderConfig>({
  title: "Chat dApp",
  rightAction: null,
});

export const userAddressAtom = atom<string | null>(null);

export const isWalletConnectedAtom = atom((get) => !!get(userAddressAtom));

export const isMintingAtom = atom(false);
