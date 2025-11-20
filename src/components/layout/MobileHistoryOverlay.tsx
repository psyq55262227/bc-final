import { useSetAtom } from "jotai";
import { mobileHistoryOpenAtom } from "../../state/atoms";
import ChatHistoryList from "../chat/ChatHistoryList";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const MobileHistoryOverlay = () => {
  const setHistoryOpen = useSetAtom(mobileHistoryOpenAtom);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      initial={{ opacity: 0, x: "-100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "-100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-text-primary">History</h2>
        <button
          onClick={() => setHistoryOpen(false)}
          className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <ChatHistoryList
          onChatSelect={() => setHistoryOpen(false)}
          variant="mobile"
          paddingClass="px-6 py-4 border-b border-gray-50"
        />
      </div>
    </motion.div>
  );
};

export default MobileHistoryOverlay;
