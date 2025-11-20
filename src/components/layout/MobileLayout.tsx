import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import {
  mobileHistoryOpenAtom,
  headerConfigAtom,
  activeConversationAtom,
} from "../../state/atoms";
import { MessageSquare, Award, Menu } from "lucide-react";
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
      const pathSegments = location.pathname.split("/").filter(Boolean);
      if (pathSegments.length > 1) newTitle = "";
      else newTitle = "Rewards";
    } else {
      newTitle = "Chat as Assets";
    }
    setHeaderConfig((prev) => ({ ...prev, title: newTitle }));
  }, [location.pathname, activeConversation, setHeaderConfig, isChatPage]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
      isActive ? "text-primary" : "text-text-secondary hover:text-text-primary"
    }`;

  return (
    <div className="flex flex-col h-dvh w-full bg-background overflow-hidden">
      <AnimatePresence>
        {historyOpen && <MobileHistoryOverlay />}
      </AnimatePresence>

      {headerConfig.title && (
        <header className="h-14 flex items-center justify-between px-4 bg-background/80 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
          <div className="w-[40px]">
            {isChatPage && (
              <button
                onClick={() => setHistoryOpen(true)}
                className="p-2 -ml-2 rounded-full hover:bg-gray-200/50 text-text-primary"
              >
                <Menu size={20} />
              </button>
            )}
          </div>
          <h1 className="text-base font-bold text-text-primary truncate">
            {headerConfig.title}
          </h1>
          <div className="flex justify-end min-w-[40px]">
            {headerConfig.rightAction}
          </div>
        </header>
      )}

      <main className="flex-1 relative overflow-hidden flex flex-col w-full">
        <Outlet />
      </main>

      <nav className="h-[60px] bg-white border-t border-border flex flex-shrink-0 z-30 pb-safe">
        <NavLink to="/chat/new" className={navLinkClass}>
          <div
            className={`p-1.5 rounded-xl mb-0.5 ${
              location.pathname.startsWith("/chat") ? "bg-primary/10" : ""
            }`}
          >
            <MessageSquare
              className={`h-5 w-5 ${
                location.pathname.startsWith("/chat") ? "fill-current" : ""
              }`}
            />
          </div>
          <span>Chat</span>
        </NavLink>
        <NavLink to="/mint-history" className={navLinkClass}>
          <div
            className={`p-1.5 rounded-xl mb-0.5 ${
              location.pathname.startsWith("/mint-history")
                ? "bg-primary/10"
                : ""
            }`}
          >
            <Award
              className={`h-5 w-5 ${
                location.pathname.startsWith("/mint-history")
                  ? "fill-current"
                  : ""
              }`}
            />
          </div>
          <span>Rewards</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default MobileLayout;
