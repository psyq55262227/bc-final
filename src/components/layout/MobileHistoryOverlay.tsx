import { useSetAtom } from "jotai";
import { mobileHistoryOpenAtom } from "../../state/atoms";
import ChatHistoryList from "../chat/ChatHistoryList";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const MobileHistoryOverlay = () => {
  const setHistoryOpen = useSetAtom(mobileHistoryOpenAtom);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-sidebar"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <header className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Chat History</h2>
        <button onClick={() => setHistoryOpen(false)} className="p-1">
          <X size={24} />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <ChatHistoryList onChatSelect={() => setHistoryOpen(false)} />
      </div>
    </motion.div>
  );
};

export default MobileHistoryOverlay;
