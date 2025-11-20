import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import { type ReactNode, type FC, useMemo, useState, useEffect } from "react";
import { Award, BotMessageSquare, Package, TrendingUp } from "lucide-react";
import {
  mintedHistoryAtom,
  totalRewardsAtom,
  conversationsAtom,
} from "../state/atoms";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  colorClass: string;
}

const StatCard: FC<StatCardProps> = ({ icon, title, value, colorClass }) => (
  <div
    className={`p-4 rounded-xl border flex flex-col md:flex-row items-center space-y-2 md:space-x-4 md:space-y-0 ${colorClass}`}
  >
    <div className="p-2 rounded-lg bg-white/50">{icon}</div>
    <div className="flex flex-col items-center md:items-start">
      <p className="text-2xl font-bold leading-none">{value}</p>
      <p className="text-xs font-medium opacity-80 mt-1">{title}</p>
    </div>
  </div>
);

const MintHistory = () => {
  const [mintedHistory] = useAtom(mintedHistoryAtom);
  const [totalRewards] = useAtom(totalRewardsAtom);
  const [conversations] = useAtom(conversationsAtom);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const validMintedHistory = useMemo(() => {
    return mintedHistory.filter(
      (item) => typeof item.id === "string" && item.id
    );
  }, [mintedHistory]);

  const totalMints = validMintedHistory.length;
  const highestReward =
    validMintedHistory.length > 0
      ? Math.max(...validMintedHistory.map((item) => item.reward))
      : 0;

  const getConversationTitle = (id: string | undefined) => {
    if (!id) return "Invalid Conversation";
    return (
      conversations.find((c) => c.id === id)?.title || "Deleted Conversation"
    );
  };

  return (
    <motion.div
      className="p-4 md:p-8 h-full w-full overflow-y-auto custom-scrollbar bg-chat-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: isHydrated ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="mb-8 hidden md:block">
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Mint Rewards
        </h1>
        <p className="text-text-secondary text-sm">
          Overview of your tokenized conversation assets.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<Award className="h-6 w-6 md:h-8 md:w-8" />}
          title="Total Earned"
          value={`${totalRewards.toFixed(2)}`}
          colorClass="bg-blue-50 border-blue-100 text-blue-700"
        />
        <StatCard
          icon={<Package className="h-6 w-6 md:h-8 md:w-8" />}
          title="Total Mints"
          value={totalMints.toString()}
          colorClass="bg-purple-50 border-purple-100 text-purple-700"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6 md:h-8 md:w-8" />}
          title="Best Reward"
          value={`${highestReward.toFixed(2)}`}
          colorClass="bg-amber-50 border-amber-100 text-amber-700"
        />
      </div>

      <div>
        <h2 className="text-lg font-bold text-text-primary mb-4">
          Recent Activity
        </h2>

        <div className="space-y-3">
          {isHydrated &&
            (validMintedHistory.length > 0 ? (
              validMintedHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center overflow-hidden">
                    <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center mr-4 flex-shrink-0 border border-gray-100">
                      <BotMessageSquare className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/mint-history/${item.id}`}
                        className="font-semibold text-text-primary hover:text-primary truncate block"
                      >
                        {getConversationTitle(item.conversationId)}
                      </Link>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {new Date(item.timestamp).toLocaleDateString()} •{" "}
                        {item.messageIds.length} messages
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="font-bold text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      +{item.reward.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-text-secondary text-center py-12 bg-white border border-gray-100 rounded-xl border-dashed">
                No mint history yet. Start chatting!
              </p>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MintHistory;
