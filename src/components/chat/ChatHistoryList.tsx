import { useAtom } from "jotai";
import { conversationsAtom, activeConversationIdAtom } from "../../state/atoms";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import type { FC } from "react";

interface ChatHistoryListProps {
  onChatSelect?: () => void;
}

const ChatHistoryList: FC<ChatHistoryListProps> = ({ onChatSelect }) => {
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
    <div className="p-2 bg-sidebar h-full">
      <div className="flex justify-between items-center mb-2 px-2">
        <h2 className="text-base font-semibold text-text-primary">History</h2>
        <button
          onClick={handleNewChat}
          className="text-primary hover:text-primary/80"
        >
          <PlusCircle className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-2">
        {conversations.map((convo) => (
          <div
            key={convo.id}
            onClick={() => handleSelectChat(convo.id)}
            className={`p-3 rounded-lg cursor-pointer ${
              activeId === convo.id ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
          >
            <p className="font-medium text-sm text-text-primary truncate">
              {convo.title}
            </p>
            <p className="text-xs text-text-secondary truncate mt-1">
              {convo.messages[convo.messages.length - 1].content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistoryList;
