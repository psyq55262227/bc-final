import { BotMessageSquare } from "lucide-react";

const ChatPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-card text-text-secondary">
      <BotMessageSquare size={64} className="mb-4" />
      <h2 className="text-xl font-semibold">Welcome to Chat as Assets</h2>
      <p>Select a conversation from the list or start a new one.</p>
    </div>
  );
};

export default ChatPlaceholder;
