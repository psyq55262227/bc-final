/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  selectedMessageIdsAtom,
  isMobileInputFocusedAtom,
} from "../../state/atoms";
import { motion } from "framer-motion";
import { Bot, Send, Paperclip } from "lucide-react";
import type { ChatMessage, Conversation } from "../../types";
import { useNavigate } from "react-router-dom";
import { getChatReply, mintChat } from "../../api";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import HeaderActions from "../common/HeaderActions";
import StatusDot from "../common/StatusDot";
import ConnectWalletModal from "../common/ConnectWalletModal";

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

const ChatBubble = ({
  message,
  isUser,
  onSelect,
  isSelected,
  isMobile,
}: {
  message: ChatMessage;
  isUser: boolean;
  isInitialLoad: boolean;
  onSelect: (id: string) => void;
  isSelected: boolean;
  isMobile: boolean;
}) => {
  const checkbox = (
    <div
      onClick={() => !message.isMinted && onSelect(message.id)}
      className={`
        flex-shrink-0 h-4 w-4 rounded-full border flex items-center justify-center transition-all mr-2 mt-1 p-0.5
        ${
          message.isMinted
            ? "border-gray-300 bg-transparent cursor-not-allowed"
            : isSelected
            ? "border-primary bg-primary cursor-pointer"
            : "border-gray-300 bg-transparent hover:border-primary cursor-pointer"
        }
      `}
    >
      {message.isMinted ? (
        <div className="h-full w-full bg-gray-300 rounded-full" />
      ) : isSelected ? (
        <div className="h-1.5 w-1.5 bg-white rounded-full" />
      ) : null}
    </div>
  );

  const timestampClass = isMobile
    ? "opacity-100"
    : "opacity-0 group-hover:opacity-100";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full mb-3 group ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && <div className="mt-1">{checkbox}</div>}

      <div
        className={`flex flex-col max-w-[85%] md:max-w-[70%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`
            relative px-4 py-2.5 text-sm leading-relaxed
            ${
              isUser
                ? "bg-primary text-white rounded-2xl rounded-tr-sm"
                : "bg-assistant-bubble text-text-primary border border-gray-200/60 rounded-2xl rounded-tl-sm"
            }
          `}
        >
          {message.content}
        </div>
        <span
          className={`text-[10px] text-gray-400 mt-0.5 px-1 transition-opacity select-none ${timestampClass}`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {isUser && <div className="mt-1 ml-2">{checkbox}</div>}
    </motion.div>
  );
};

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex items-center space-x-1 px-4 py-3 bg-white border border-gray-200/60 rounded-2xl rounded-tl-sm w-fit mb-3 ml-6"
  >
    <div
      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "0s" }}
    />
    <div
      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "0.2s" }}
    />
    <div
      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "0.4s" }}
    />
  </motion.div>
);

const ChatInterface = () => {
  const [activeConvo] = useAtom(activeConversationAtom);
  const setConversations = useSetAtom(conversationsAtom);
  const setMintedHistory = useSetAtom(mintedHistoryAtom);
  const [isMinting, setIsMinting] = useAtom(isMintingAtom);
  const activeId = useAtomValue(activeConversationIdAtom);
  const isConnected = useAtomValue(isWalletConnectedAtom);
  const userAddress = useAtomValue(userAddressAtom);
  const setHeaderConfig = useSetAtom(headerConfigAtom);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [selectedIds, setSelectedIds] = useAtom(selectedMessageIdsAtom);

  const setIsMobileInputFocused = useSetAtom(isMobileInputFocusedAtom);

  const [inputValue, setInputValue] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const prevMessageCountRef = useRef<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { openConnectModal } = useConnectModal();
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setIsMobileInputFocused(isInputFocused);
    }
  }, [isInputFocused, isMobile, setIsMobileInputFocused]);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [activeId, setSelectedIds]);
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
    setIsInputFocused(false);
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
          if (c.id === conversationToUpdateId)
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === TYPING_ID ? aiMessage : m
              ),
            };
          return c;
        })
      );
    } catch (error) {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationToUpdateId)
            return {
              ...c,
              messages: c.messages.filter((m) => m.id !== TYPING_ID),
            };
          return c;
        })
      );
    }
  };

  const handleToggleMessageSelection = (messageId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) newSet.delete(messageId);
      else newSet.add(messageId);
      return newSet;
    });
  };

  const handleMint = useCallback(async () => {
    if (!activeConvo || selectedIds.size === 0 || isMinting || !userAddress)
      return;
    const messagesToMint = activeConvo.messages.filter(
      (m) => selectedIds.has(m.id) && !m.isMinted
    );
    if (messagesToMint.length === 0) {
      toast.info("All selected messages have already been minted.");
      return;
    }
    setIsMinting(true);
    const mintToastId = toast.loading(`Minting...`);
    try {
      const { metadataUrl } = await mintChat(messagesToMint, userAddress);
      toast.update(mintToastId, {
        render: "Mint successful!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvo.id
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  selectedIds.has(m.id) ? { ...m, isMinted: true } : m
                ),
              }
            : c
        )
      );
      const newMintInfo = {
        id: `mint-${self.crypto.randomUUID()}`,
        conversationId: activeConvo.id,
        messageIds: messagesToMint.map((m) => m.id),
        metadataUrl,
        reward: Math.floor(Math.random() * (messagesToMint.length * 50)) + 20,
        timestamp: Date.now(),

        ownerAddress: userAddress,
        price: 0,
        isListed: false,
        isSold: false,
      };
      setMintedHistory((prev) => [newMintInfo, ...prev]);
      setSelectedIds(new Set());
    } catch (error: any) {
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
    selectedIds,
    setSelectedIds,
  ]);

  const handleMintClick = useCallback(() => {
    if (isConnected) handleMint();
    else setIsModalOpen(true);
  }, [handleMint, isConnected]);

  useEffect(() => {
    const actions = (
      <HeaderActions
        onMint={handleMintClick}
        isSelectionEmpty={selectedIds.size === 0}
        activeConvoExists={!!activeConvo}
      />
    );
    if (isMobile)
      setHeaderConfig((prev) => ({ ...prev, rightAction: actions }));
    else setHeaderConfig((prev) => ({ ...prev, rightAction: null }));
    return () => {
      if (isMobile) setHeaderConfig((prev) => ({ ...prev, rightAction: null }));
    };
  }, [isMobile, activeConvo, handleMintClick, setHeaderConfig, selectedIds]);

  const isAiTyping =
    activeConvo?.messages.some((m) => m.id === "ai_is_typing_placeholder") ??
    false;

  return (
    <div className="flex flex-col h-full w-full relative bg-chat-bg md:rounded-[var(--radius-card)] overflow-hidden">
      {!isMobile && (
        <header className="px-6 py-3 flex justify-between items-center flex-shrink-0 bg-transparent">
          <h1 className="text-base font-semibold text-text-primary flex items-center space-x-2">
            <span>{activeConvo?.title || "New Conversation"}</span>
            <StatusDot isConnected={isConnected} />
          </h1>
          <HeaderActions
            onMint={handleMintClick}
            isSelectionEmpty={selectedIds.size === 0}
            activeConvoExists={!!activeConvo}
          />
        </header>
      )}

      <main
        className="flex-1 overflow-y-auto custom-scrollbar px-4 py-2 flex flex-col"
        onClick={() => setIsInputFocused(false)}
      >
        {!activeConvo ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
            <div className="bg-white p-4 rounded-2xl mb-4 border border-gray-200">
              <Bot size={32} className="text-gray-400" />
            </div>
            <h2 className="text-base font-medium text-text-primary">
              Start a new chat
            </h2>
          </div>
        ) : (
          <div className="w-full max-w-3xl mx-auto mt-auto">
            {activeConvo.messages.map((msg, index) => {
              const prevMsg = activeConvo.messages[index - 1];
              const showSeparator =
                index === 0 ||
                !isSameDay(
                  new Date(msg.timestamp),
                  new Date(prevMsg.timestamp)
                );

              if (msg.id === "ai_is_typing_placeholder")
                return <TypingIndicator key={msg.id} />;

              return (
                <div key={msg.id}>
                  {showSeparator && (
                    <div className="flex items-center my-4 opacity-40">
                      <div className="h-px bg-gray-300 flex-1" />
                      <span className="px-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                        {formatDateSeparator(msg.timestamp)}
                      </span>
                      <div className="h-px bg-gray-300 flex-1" />
                    </div>
                  )}
                  <ChatBubble
                    message={msg}
                    isUser={msg.role === "user"}
                    isInitialLoad={isInitialLoad}
                    isSelected={selectedIds.has(msg.id)}
                    onSelect={handleToggleMessageSelection}
                    isMobile={isMobile}
                  />
                </div>
              );
            })}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        )}
      </main>

      <footer className="p-3 md:p-4 flex-shrink-0 z-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            layout
            initial={{ borderRadius: 20, backgroundColor: "#ffffff" }}
            animate={{
              borderRadius: 20,
              backgroundColor: "#ffffff",
            }}
            className={`relative border transition-colors duration-200 bg-white ${
              isInputFocused ? "border-primary" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col p-1">
              <div className="flex items-end">
                <button className="p-2 text-gray-400 hover:text-primary transition-colors hidden md:block">
                  <Paperclip size={18} />
                </button>

                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Message..."
                  className={`
                    w-full bg-transparent border-none focus:ring-0 resize-none py-2.5 px-2 text-sm text-text-primary placeholder-gray-400
                    no-scrollbar leading-relaxed
                  `}
                  style={{
                    minHeight: "40px",
                    height: isInputFocused ? "100px" : "40px",
                    transition: "height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  }}
                />

                <button
                  onClick={handleSendMessage}
                  disabled={isAiTyping || !inputValue}
                  className={`
                    p-1.5 rounded-lg mb-1 mr-1 transition-all duration-200 flex-shrink-0
                    ${
                      inputValue
                        ? "bg-primary text-white hover:bg-primary-dark"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }
                  `}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      <ConnectWalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          if (openConnectModal) openConnectModal();
        }}
      />
    </div>
  );
};

export default ChatInterface;
