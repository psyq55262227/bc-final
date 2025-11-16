import { Outlet, NavLink } from "react-router-dom";
import ChatHistoryList from "../chat/ChatHistoryList";
import { Award, MessageSquare, Wallet, BotMessageSquare } from "lucide-react";

const DesktopLayout = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-2 rounded-md text-sm ${
      isActive
        ? "bg-primary/10 text-primary font-semibold"
        : "text-text-secondary hover:bg-gray-100"
    }`;

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-1/3 max-w-xs flex flex-col bg-sidebar border-r border-border">
        <header className="p-3 border-b border-border">
          <div className="flex items-center space-x-2">
            <BotMessageSquare className="h-6 w-6 text-primary" />
            <h1 className="text-lg py-1 font-semibold text-text-primary">
              Chat as Assets
            </h1>
          </div>
        </header>
        <nav className="p-2 space-y-2 border-b border-border">
          <NavLink to="/chat/new" className={navLinkClass}>
            <MessageSquare className="mr-2 h-6 w-4" />
            Chats
          </NavLink>
          <NavLink to="/mint-history" className={navLinkClass}>
            <Award className="mr-2 h-6 w-4" />
            Mint Rewards
          </NavLink>
          <NavLink to="/connect-wallet" className={navLinkClass}>
            <Wallet className="mr-2 h-6 w-4" />
            Connect Wallet
          </NavLink>
        </nav>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <ChatHistoryList />
        </div>
      </aside>

      <main className="w-2/3 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default DesktopLayout;
