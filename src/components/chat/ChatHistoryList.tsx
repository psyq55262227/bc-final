import { useAtom } from "jotai";
import { conversationsAtom, activeConversationIdAtom } from "../../state/atoms";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import type { FC } from "react";
import { motion } from "framer-motion";

interface ChatHistoryListProps {
  onChatSelect?: () => void;
  variant?: "desktop" | "mobile";
  paddingClass?: string;
}

const ChatHistoryList: FC<ChatHistoryListProps> = ({
  onChatSelect,
  variant = "desktop",
  paddingClass = "p-3",
}) => {
  const [conversations] = useAtom(conversationsAtom);
  const [activeId, setActiveId] = useAtom(activeConversationIdAtom);
  const navigate = useNavigate();

  const handleSelectChat = (id: string) => {
    setActiveId(id);
    navigate(`/chat/${id}`);
    onChatSelect?.();
  };

  const handleNewChat = () => {
    setActiveId(null);
    navigate("/chat/new");
    onChatSelect?.();
  };

  return (
    <div className="flex flex-col h-full">
      {variant === "mobile" && (
        <div className="mb-4 px-4 pt-2">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center py-2 bg-primary text-white rounded-xl font-semibold active:scale-95 transition-transform border border-transparent"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Chat
          </button>
        </div>
      )}

      <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
        {conversations.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            No conversations yet.
          </div>
        )}
        {conversations.map((convo, index) => {
          const isActive = activeId === convo.id;
          return (
            <motion.div
              key={convo.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelectChat(convo.id)}
              className={`
                  cursor-pointer transition-colors duration-200 rounded-lg group
                  ${paddingClass}
                  ${
                    isActive
                      ? "bg-gray-200/60 text-text-primary"
                      : "hover:bg-gray-100 text-text-secondary hover:text-text-primary"
                  }
                `}
            >
              <div className="flex flex-col">
                <h3
                  className={`text-sm font-medium truncate ${
                    isActive ? "font-semibold" : ""
                  }`}
                >
                  {convo.title || "New Conversation"}
                </h3>
                <p className="text-xs text-gray-400 truncate mt-0.5 opacity-80 group-hover:opacity-100">
                  {convo.messages[convo.messages.length - 1]?.content ||
                    "Empty"}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatHistoryList;
