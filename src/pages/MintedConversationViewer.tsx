import { useParams, Link } from "react-router-dom";
import { useAtomValue } from "jotai";
import { mintedHistoryAtom, conversationsAtom } from "../state/atoms";
import { ArrowLeft } from "lucide-react";
import type { ChatMessage } from "../types";
import { motion } from "framer-motion";

const ChatBubbleReadOnly = ({
  message,
  isUser,
}: {
  message: ChatMessage;
  isUser: boolean;
}) => (
  <motion.div
    className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-6`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div
      className={`max-w-[85%] md:max-w-[70%] px-5 py-3.5 rounded-2xl leading-relaxed ${
        isUser
          ? "rounded-br-sm bg-primary text-white"
          : "rounded-bl-sm bg-white text-text-primary"
      }`}
    >
      {message.content}
    </div>
  </motion.div>
);

const MintedConversationViewer = () => {
  const { id } = useParams<{ id: string }>();
  const mintedHistory = useAtomValue(mintedHistoryAtom);
  const conversations = useAtomValue(conversationsAtom);

  const mintInfo = mintedHistory.find((m) => m.id === id);
  const conversation = conversations.find(
    (c) => c.id === mintInfo?.conversationId
  );

  if (!mintInfo || !conversation) {
    return (
      <div className="h-full w-full bg-chat-bg rounded-[var(--radius-card)] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold text-text-primary">
          Mint record not found.
        </h2>
        <Link to="/mint-history" className="text-primary hover:underline mt-4">
          Go back
        </Link>
      </div>
    );
  }

  const mintedMessages = conversation.messages.filter((m) =>
    mintInfo.messageIds.includes(m.id)
  );

  return (
    <div className="flex flex-col h-full w-full bg-chat-bg md:rounded-[var(--radius-card)] overflow-hidden">
      <header className="px-6 py-4 flex items-center flex-shrink-0 bg-transparent">
        <Link
          to="/mint-history"
          className="mr-4 p-2 rounded-full hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-text-primary truncate">
            {conversation.title}
          </h1>
          <p className="text-xs text-text-secondary flex items-center">
            Minted {new Date(mintInfo.timestamp).toLocaleString()}
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4">
        <div className="w-full max-w-3xl mx-auto">
          {mintedMessages.map((msg) => (
            <ChatBubbleReadOnly
              key={msg.id}
              message={msg}
              isUser={msg.role === "user"}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default MintedConversationViewer;
