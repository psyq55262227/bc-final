import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import {
  mobileHistoryOpenAtom,
  headerConfigAtom,
  activeConversationAtom,
} from "../../state/atoms";
import { MessageSquare, Award, Menu, Wallet } from "lucide-react";
import MobileHistoryOverlay from "./MobileHistoryOverlay";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const MobileLayout = () => {
  const [historyOpen, setHistoryOpen] = useAtom(mobileHistoryOpenAtom);
  const [headerConfig, setHeaderConfig] = useAtom(headerConfigAtom);
  const activeConversation = useAtomValue(activeConversationAtom);
  const location = useLocation();

  const isChatPage = location.pathname.startsWith("/chat");

  useEffect(() => {
    let newTitle: string;

    if (isChatPage) {
      if (location.pathname === "/chat/new") {
        newTitle = "New Chat";
      } else {
        newTitle = activeConversation?.title || "Chat";
      }
    } else if (location.pathname.startsWith("/mint-history")) {
      newTitle = "Rewards";
    } else if (location.pathname.startsWith("/connect-wallet")) {
      newTitle = "Connect Wallet";
    } else {
      newTitle = "Chat as Assets";
    }

    setHeaderConfig((prev) => ({ ...prev, title: newTitle }));
  }, [location.pathname, activeConversation, setHeaderConfig, isChatPage]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center flex-1 p-2 text-sm ${
      isActive ? "text-primary" : "text-text-secondary"
    }`;

  return (
    <div className="flex flex-col h-screen bg-background">
      <AnimatePresence>
        {historyOpen && <MobileHistoryOverlay />}
      </AnimatePresence>

      <header className="h-16 flex items-center justify-between p-4 bg-sidebar border-b border-border flex-shrink-0">
        <div className="w-[40px]">
          {isChatPage && (
            <button onClick={() => setHistoryOpen(true)} className="p-1">
              <Menu size={24} />
            </button>
          )}
        </div>

        <h1 className="text-lg font-semibold truncate">{headerConfig.title}</h1>

        <div className="w-[40px] flex justify-end">
          {headerConfig.rightAction}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>

      <nav className="h-16 bg-sidebar border-t border-border flex flex-shrink-0">
        <NavLink to="/chat/new" className={navLinkClass}>
          <MessageSquare className="h-6 w-6 mb-1" />
          Chat
        </NavLink>
        <NavLink to="/mint-history" className={navLinkClass}>
          <Award className="h-6 w-6 mb-1" />
          Rewards
        </NavLink>
        <NavLink to="/connect-wallet" className={navLinkClass}>
          <Wallet className="h-6 w-6 mb-1" />
          Wallet
        </NavLink>
      </nav>
    </div>
  );
};

export default MobileLayout;
