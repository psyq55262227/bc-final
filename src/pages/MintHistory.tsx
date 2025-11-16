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
  bgColor: string;
  textColor: string;
}

const StatCard: FC<StatCardProps> = ({
  icon,
  title,
  value,
  bgColor,
  textColor,
}) => (
  <div
    className={`p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2 
                md:flex-row md:space-y-0 md:space-x-4 md:text-left md:justify-start ${bgColor} ${textColor}`}
  >
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium opacity-70 whitespace-nowrap">
        {title}
      </p>
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
      className="p-4 md:p-8 h-full bg-background text-text-primary overflow-y-auto custom-scrollbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: isHydrated ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold mb-2">Mint Rewards</h1>
        <p className="text-text-secondary">
          Here is a summary of your rewards from minting conversations.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<Award className="h-6 w-6 md:h-8 md:w-8" />}
          title="Total Rewards"
          value={`${totalRewards.toFixed(2)}`}
          bgColor="bg-blue-100"
          textColor="text-blue-800"
        />
        <StatCard
          icon={<Package className="h-6 w-6 md:h-8 md:w-8" />}
          title="Total Mints"
          value={totalMints.toString()}
          bgColor="bg-slate-200"
          textColor="text-slate-800"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6 md:h-8 md:w-8" />}
          title="Highest Reward"
          value={`${highestReward.toFixed(2)}`}
          bgColor="bg-amber-100"
          textColor="text-amber-800"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Minting History</h2>

        <div className="space-y-4">
          {isHydrated &&
            (validMintedHistory.length > 0 ? (
              validMintedHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-card p-4 rounded-lg border border-border flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <BotMessageSquare className="h-8 w-8 mr-4 text-text-secondary flex-shrink-0" />
                    <div className="flex-grow">
                      <Link
                        to={`/mint-history/${item.id}`}
                        className="font-semibold text-text-primary hover:underline"
                      >
                        {`Minted ${
                          item.messageIds.length
                        } messages from "${getConversationTitle(
                          item.conversationId
                        )}"`}
                      </Link>
                      <p className="text-sm text-text-secondary mt-1">
                        Minted on: {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-lg text-green-600">
                      +{item.reward.toFixed(2)}
                    </p>
                    <p className="text-sm text-text-secondary">Tokens</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-text-secondary text-center py-8">
                You haven't minted any conversations yet.
              </p>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MintHistory;
