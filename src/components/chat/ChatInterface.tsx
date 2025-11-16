import { useState, useEffect, useRef, useCallback } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  activeConversationAtom,
  isMintingAtom,
  headerConfigAtom,
  isWalletConnectedAtom,
  activeConversationIdAtom,
  conversationsAtom,
  mintedHistoryAtom,
  userAddressAtom,
} from "../../state/atoms";
import { motion } from "framer-motion";
import { Bot, Send } from "lucide-react";
import type { ChatMessage, Conversation } from "../../types";
import { useNavigate } from "react-router-dom";
import { getChatReply, mintChat } from "../../api";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";

import HeaderActions from "../common/HeaderActions";
import StatusDot from "../common/StatusDot";

const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const formatDateSeparator = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today.setDate(today.getDate() - 1));

  if (isSameDay(date, new Date())) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const NEW_MESSAGE_ANIMATION = {
  initial: { opacity: 0, scale: 0.8, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { duration: 0.3 },
};

const ChatBubble = ({
  message,
  isUser,
  isInitialLoad,
}: {
  message: ChatMessage;
  isUser: boolean;
  isInitialLoad: boolean;
}) => {
  return (
    <motion.div
      layout
      initial={isInitialLoad ? false : NEW_MESSAGE_ANIMATION.initial}
      animate={NEW_MESSAGE_ANIMATION.animate}
      transition={NEW_MESSAGE_ANIMATION.transition}
      style={{ transformOrigin: isUser ? "bottom right" : "bottom left" }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-md p-3 rounded-xl ${
          isUser ? "rounded-br-none" : "rounded-bl-none"
        } ${
          isUser
            ? "bg-user-bubble text-white"
            : "bg-assistant-bubble text-text-primary"
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
};

const DateSeparator = ({
  timestamp,
  isInitialLoad,
}: {
  timestamp: number;
  isInitialLoad: boolean;
}) => {
  return (
    <motion.div
      layout
      initial={isInitialLoad ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center items-center my-4"
    >
      <hr className="w-full border-border" />
      <span className="px-2 text-xs text-text-secondary whitespace-nowrap">
        {formatDateSeparator(timestamp)}
      </span>
      <hr className="w-full border-border" />
    </motion.div>
  );
};

const NewChatPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <Bot size={48} className="text-gray-300 mb-4" />
    <h2 className="text-xl font-semibold text-text-primary">
      Start a new conversation
    </h2>
    <p className="text-text-secondary">
      Send a message to begin. Your chat history will be saved.
    </p>
  </div>
);

const TypingIndicator = () => {
  return (
    <motion.div
      className="flex items-center space-x-1.5 p-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-sm text-text-secondary">AI is typing</span>
      <motion.div
        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
        animate={{ y: [0, -2, 0] }}
        transition={{
          duration: 0.8,
          delay: 0.1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
        animate={{ y: [0, -2, 0] }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

const ChatInterface = () => {
  const activeConvo = useAtomValue(activeConversationAtom);
  const setConversations = useSetAtom(conversationsAtom);
  const setMintedHistory = useSetAtom(mintedHistoryAtom);
  const [isMinting, setIsMinting] = useAtom(isMintingAtom);
  const activeId = useAtomValue(activeConversationIdAtom);
  const isConnected = useAtomValue(isWalletConnectedAtom);
  const userAddress = useAtomValue(userAddressAtom);
  const setHeaderConfig = useSetAtom(headerConfigAtom);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const [inputValue, setInputValue] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const prevMessageCountRef = useRef<number>(0);

  useEffect(() => {
    if (activeConvo) {
      setIsInitialLoad(true);

      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });

      const timer = setTimeout(() => setIsInitialLoad(false), 50);

      return () => clearTimeout(timer);
    }
  }, [activeConvo?.id]);

  useEffect(() => {
    if (
      activeConvo &&
      activeConvo.messages.length > prevMessageCountRef.current
    ) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return () => clearTimeout(timer);
    }
    prevMessageCountRef.current = activeConvo?.messages.length ?? 0;
  }, [activeConvo?.messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const TYPING_ID = "ai_is_typing_placeholder";
    const userMessage: ChatMessage = {
      id: self.crypto.randomUUID(),
      role: "user",
      content: inputValue,
      timestamp: Date.now(),
    };
    const typingMessage: ChatMessage = {
      id: TYPING_ID,
      role: "assistant",
      content: "...",
      timestamp: Date.now(),
    };

    const currentInput = inputValue;
    setInputValue("");

    let conversationToUpdateId: string;
    let messagesForApi: ChatMessage[];

    if (!activeId) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: currentInput.substring(0, 30),
        messages: [userMessage, typingMessage],
        timestamp: Date.now(),
      };
      setConversations((prev) => [newConversation, ...prev]);
      conversationToUpdateId = newConversation.id;
      messagesForApi = [userMessage];
      navigate(`/chat/${newConversation.id}`, { replace: true });
    } else {
      messagesForApi = [...(activeConvo?.messages || []), userMessage];
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: [...c.messages, userMessage, typingMessage] }
            : c
        )
      );
      conversationToUpdateId = activeId;
    }

    try {
      const { reply } = await getChatReply(messagesForApi);
      const aiMessage: ChatMessage = {
        id: self.crypto.randomUUID(),
        role: "assistant",
        content: reply,
        timestamp: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationToUpdateId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === TYPING_ID ? aiMessage : m
              ),
            };
          }
          return c;
        })
      );
    } catch (error) {
      console.error("Failed to get AI reply:", error);
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationToUpdateId) {
            return {
              ...c,
              messages: c.messages.filter((m) => m.id !== TYPING_ID),
            };
          }
          return c;
        })
      );
    }
  };

  const handleMint = useCallback(async () => {
    if (!activeConvo || activeConvo.isMinted || isMinting || !userAddress)
      return;

    setIsMinting(true);
    const mintToastId = toast.loading("Preparing to mint your conversation...");

    try {
      const { metadataUrl } = await mintChat(activeConvo.messages, userAddress);

      toast.update(mintToastId, {
        render: "Mint successful!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvo.id ? { ...c, isMinted: true } : c
        )
      );
      const newMintInfo = {
        conversationId: activeConvo.id,
        metadataUrl,
        reward: Math.floor(Math.random() * 200) + 50,
        timestamp: Date.now(),
      };
      setMintedHistory((prev) => [...prev, newMintInfo]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Mint failed:", error);
      toast.update(mintToastId, {
        render: `Mint failed: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsMinting(false);
    }
  }, [
    activeConvo,
    isMinting,
    setConversations,
    setIsMinting,
    setMintedHistory,
    userAddress,
  ]);

  useEffect(() => {
    if (isMobile) {
      const actions = (
        <HeaderActions
          onMint={handleMint}
          isMinted={activeConvo?.isMinted ?? false}
          activeConvoExists={!!activeConvo}
        />
      );
      setHeaderConfig((prev) => ({ ...prev, rightAction: actions }));
    }

    return () => {
      if (isMobile) {
        setHeaderConfig((prev) => ({ ...prev, rightAction: null }));
      }
    };
  }, [isMobile, activeConvo, handleMint, setHeaderConfig]);

  const isAiTyping =
    activeConvo?.messages.some((m) => m.id === "ai_is_typing_placeholder") ??
    false;

  return (
    <div className="flex flex-col h-full bg-card">
      {!isMobile && (
        <header className="p-4 border-b border-border flex justify-between items-center flex-shrink-0">
          <h1 className="text-lg font-bold text-text-primary flex items-center space-x-2">
            <span>{activeConvo?.title || "New Chat"}</span>
            <StatusDot isConnected={isConnected} />
          </h1>
          <HeaderActions
            onMint={handleMint}
            isMinted={activeConvo?.isMinted ?? false}
            activeConvoExists={!!activeConvo}
          />
        </header>
      )}

      <main className="flex-1 p-4 overflow-x-hidden overflow-y-auto custom-scrollbar flex flex-col">
        {!activeConvo ? (
          <NewChatPlaceholder />
        ) : (
          <div
            className="mt-auto w-full"
            style={{ opacity: isInitialLoad ? 0 : 1 }}
          >
            <div key={activeConvo.id}>
              {activeConvo.messages.map((msg, index) => {
                const prevMsg = activeConvo.messages[index - 1];
                const showSeparator =
                  index === 0 ||
                  !isSameDay(
                    new Date(msg.timestamp),
                    new Date(prevMsg.timestamp)
                  );

                if (msg.id === "ai_is_typing_placeholder") {
                  return <TypingIndicator key={msg.id} />;
                }

                return (
                  <div key={msg.id}>
                    {showSeparator && (
                      <DateSeparator
                        timestamp={msg.timestamp}
                        isInitialLoad={isInitialLoad}
                      />
                    )}
                    <ChatBubble
                      message={msg}
                      isUser={msg.role === "user"}
                      isInitialLoad={isInitialLoad}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>
      <footer className="p-4 border-t border-border flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="w-full p-3 pr-12 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
          />
          <button
            onClick={handleSendMessage}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary disabled:text-gray-400"
            disabled={isAiTyping || !inputValue}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;
