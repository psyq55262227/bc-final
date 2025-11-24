import { Outlet, Link, useLocation } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import {
  mobileHistoryOpenAtom,
  headerConfigAtom,
  activeConversationAtom,
  isMobileInputFocusedAtom,
} from "../../state/atoms";
import { MessageSquare, Award, Menu } from "lucide-react";
import MobileHistoryOverlay from "./MobileHistoryOverlay";
import { AnimatePresence } from "framer-motion";

const MobileLayout = () => {
  const [historyOpen, setHistoryOpen] = useAtom(mobileHistoryOpenAtom);
  const [headerConfig] = useAtom(headerConfigAtom);
  const activeConversation = useAtomValue(activeConversationAtom);
  const isInputFocused = useAtomValue(isMobileInputFocusedAtom);

  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat");
  const chatTabTarget = isChatPage ? location.pathname : "/chat/new";

  let pageTitle = "";
  let isRewardsPage = false;

  if (isChatPage) {
    if (location.pathname === "/chat/new") {
      pageTitle = "New Chat";
    } else {
      pageTitle = activeConversation?.title || "Chat";
    }
  } else if (location.pathname.startsWith("/mint-history")) {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length > 1) {
      pageTitle = "";
    } else {
      pageTitle = "Rewards";
      isRewardsPage = true;
    }
  } else {
    pageTitle = "Chat as Assets";
  }

  const baseLinkClass =
    "flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors";

  return (
    <div className="flex flex-col h-dvh w-full bg-background overflow-hidden">
      <AnimatePresence>
        {historyOpen && <MobileHistoryOverlay />}
      </AnimatePresence>

      {pageTitle && (
        <header
          className={`
            h-14 px-4 bg-background/80 backdrop-blur-md sticky top-0 z-20 flex-shrink-0 border-b border-gray-100/50
            flex items-center relative
            ${isRewardsPage ? "justify-center" : "justify-between"}
          `}
        >
          {isRewardsPage ? (
            <h1 className="text-base font-bold text-text-primary">
              {pageTitle}
            </h1>
          ) : (
            <div className="flex items-center min-w-0 flex-1 mr-10">
              <div className="w-[32px] flex-shrink-0 flex items-center">
                <button
                  onClick={() => setHistoryOpen(true)}
                  className="p-2 -ml-2 rounded-full hover:bg-gray-200/50 text-text-primary"
                >
                  <Menu size={20} />
                </button>
              </div>
              <h1 className="text-base font-bold text-text-primary truncate">
                {pageTitle}
              </h1>
            </div>
          )}

          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
            {headerConfig.rightAction}
          </div>
        </header>
      )}

      <main className="flex-1 relative overflow-hidden flex flex-col w-full">
        <Outlet />
      </main>

      <nav
        className={`
          h-[60px] bg-white border-t border-border flex-shrink-0 z-30 pb-safe
          ${isInputFocused ? "hidden" : "flex"} 
        `}
      >
        <Link
          to={chatTabTarget}
          className={`${baseLinkClass} ${
            isChatPage
              ? "text-primary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <div
            className={`p-1 rounded-xl mb-0.5 ${
              isChatPage ? "bg-primary/10" : ""
            }`}
          >
            <MessageSquare
              className={`h-5 w-5 ${isChatPage ? "fill-current" : ""}`}
            />
          </div>
          <span>Chat</span>
        </Link>

        <Link
          to="/mint-history"
          className={`${baseLinkClass} ${
            location.pathname.startsWith("/mint-history")
              ? "text-primary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <div
            className={`p-1 rounded-xl mb-0.5 ${
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
        </Link>
      </nav>
    </div>
  );
};

export default MobileLayout;
