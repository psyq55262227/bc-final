import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import { type ReactNode, type FC } from "react";
import { Award, BotMessageSquare, Package, TrendingUp } from "lucide-react";
import {
  mintedHistoryAtom,
  totalRewardsAtom,
  conversationsAtom,
} from "../state/atoms";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

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
      <p className="text-xs font-medium opacity-70">{title}</p>
    </div>
  </div>
);

const MintHistory = () => {
  const [mintedHistory] = useAtom(mintedHistoryAtom);
  const [totalRewards] = useAtom(totalRewardsAtom);
  const [conversations] = useAtom(conversationsAtom);

  const totalMints = mintedHistory.length;
  const highestReward =
    mintedHistory.length > 0
      ? Math.max(...mintedHistory.map((item) => item.reward))
      : 0;

  const getConversationTitle = (id: string) => {
    return conversations.find((c) => c.id === id)?.title || "Conversation";
  };

  return (
    <motion.div
      className="p-4 md:p-8 h-full bg-background text-text-primary overflow-y-auto custom-scrollbar"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <header className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold mb-2">Mint Rewards</h1>
        <p className="text-text-secondary">
          Here is a summary of your rewards from minting conversations.
        </p>
      </header>

      <motion.div
        className="grid grid-cols-3 gap-4 mb-8"
        variants={itemVariants}
      >
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
      </motion.div>

      <div>
        <h2 className="text-xl font-bold mb-4">Minting History</h2>
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {mintedHistory.length > 0 ? (
            mintedHistory.map((item) => (
              <motion.div
                key={item.conversationId}
                className="bg-card p-4 rounded-lg border border-border flex justify-between items-center"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  <BotMessageSquare className="h-8 w-8 mr-4 text-text-secondary flex-shrink-0" />
                  <div className="flex-grow">
                    <Link
                      to={`/chat/${item.conversationId}`}
                      className="font-semibold text-text-primary hover:underline"
                    >
                      {getConversationTitle(item.conversationId)}
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
              </motion.div>
            ))
          ) : (
            <motion.p
              className="text-text-secondary text-center py-8"
              variants={itemVariants}
            >
              You haven't minted any conversations yet.
            </motion.p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MintHistory;
