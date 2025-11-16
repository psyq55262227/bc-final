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
    className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div
      className={`max-w-md p-3 rounded-xl ${
        isUser
          ? "rounded-br-none bg-user-bubble text-white"
          : "rounded-bl-none bg-assistant-bubble text-text-primary"
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
      <div className="p-8 text-center bg-card h-full">
        <h2 className="text-xl font-semibold text-text-primary">
          Mint record not found.
        </h2>
        <p className="text-text-secondary">
          It might have been part of a deleted conversation.
        </p>
        <Link
          to="/mint-history"
          className="text-primary hover:underline mt-4 inline-block"
        >
          Go back to history
        </Link>
      </div>
    );
  }

  const mintedMessages = conversation.messages.filter((m) =>
    mintInfo.messageIds.includes(m.id)
  );

  return (
    <div className="flex flex-col h-full bg-card">
      <header className="p-4 border-b border-border flex items-center flex-shrink-0">
        <Link
          to="/mint-history"
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-text-primary truncate">
            Minted from "{conversation.title}"
          </h1>
          <p className="text-sm text-text-secondary">
            {new Date(mintInfo.timestamp).toLocaleString()}
          </p>
        </div>
      </header>
      <main className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {mintedMessages.map((msg) => (
          <ChatBubbleReadOnly
            key={msg.id}
            message={msg}
            isUser={msg.role === "user"}
          />
        ))}
      </main>
    </div>
  );
};

export default MintedConversationViewer;
