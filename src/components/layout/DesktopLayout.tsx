import { Outlet, NavLink, Link } from "react-router-dom";
import ChatHistoryList from "../chat/ChatHistoryList";
import {
  Award,
  MessageSquare,
  BotMessageSquare,
  ShoppingBag,
} from "lucide-react";

const DesktopLayout = () => {
  const navItemPadding = "px-3 py-2.5";

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center ${navItemPadding} rounded-lg text-sm font-medium transition-all duration-200 mb-1 group ${
      isActive
        ? "bg-primary/10 text-primary font-semibold"
        : "text-text-secondary hover:text-text-primary hover:bg-gray-50"
    }`;

  return (
    <div className="flex h-screen w-full bg-background p-4 gap-0 overflow-hidden">
      <aside className="w-72 flex flex-col flex-shrink-0 py-2 pr-4">
        <div className="px-3 mb-6 flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BotMessageSquare className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-text-primary tracking-tight">
            Chat Assets
          </h1>
        </div>

        <nav className="space-y-1 mb-6">
          <NavLink to="/chat/new" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <MessageSquare
                  className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                    isActive ? "fill-current text-primary" : ""
                  }`}
                />
                <span>Chats</span>
              </>
            )}
          </NavLink>
          <NavLink to="/mint-history" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <Award
                  className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                    isActive ? "fill-current" : ""
                  }`}
                />
                <span>My Assets</span>
              </>
            )}
          </NavLink>

          <Link
            to="/market"
            className={`relative flex items-center ${navItemPadding} rounded-lg text-sm font-medium transition-all duration-200 mb-1 text-text-secondary hover:text-text-primary hover:bg-gray-50`}
          >
            <ShoppingBag className="mr-3 h-5 w-5" />
            <span>Marketplace</span>
          </Link>
        </nav>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-3 text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
            History
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar -ml-2 pr-2">
            <ChatHistoryList paddingClass="px-3 py-2 mx-2" />
          </div>
        </div>
      </aside>
      <main className="flex-1 relative overflow-hidden flex flex-col rounded-[var(--radius-card)] bg-chat-bg border border-border/50">
        <Outlet />
      </main>
    </div>
  );
};

export default DesktopLayout;
