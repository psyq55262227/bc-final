import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSetAtom, useAtomValue } from "jotai";
import { activeConversationIdAtom, conversationsAtom } from "../state/atoms";
import ChatInterface from "../components/chat/ChatInterface";
import { toast } from "react-toastify";

const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const setActiveId = useSetAtom(activeConversationIdAtom);
  const conversations = useAtomValue(conversationsAtom);

  useEffect(() => {
    if (id && id !== "new") {
      const conversationExists = conversations.some((c) => c.id === id);
      if (!conversationExists) {
        toast.error("Conversation not found.");
        navigate("/chat/new", { replace: true });
        return;
      }
    }
    setActiveId(id === "new" ? null : id ?? null);
  }, [id, setActiveId, conversations, navigate]);

  return <ChatInterface />;
};

export default ChatPage;
