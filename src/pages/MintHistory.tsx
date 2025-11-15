import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import { Award, BotMessageSquare, ExternalLink } from "lucide-react";
import {
  mintedHistoryAtom,
  totalRewardsAtom,
  conversationsAtom,
} from "../state/atoms";

const MintHistory = () => {
  const [mintedHistory] = useAtom(mintedHistoryAtom);
  const [totalRewards] = useAtom(totalRewardsAtom);
  const [conversations] = useAtom(conversationsAtom);

  const getConversationTitle = (id: string) => {
    return conversations.find((c) => c.id === id)?.title || "Conversation";
  };

  return (
    <div className="p-4 md:p-8 h-full bg-background text-text-primary">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mint Rewards</h1>
        <p className="text-text-secondary">
          Here is a summary of your rewards from minting conversations.
        </p>
      </header>

      {/* 总奖励卡片 */}
      <div className="bg-card p-6 rounded-xl shadow-sm mb-8 border border-border">
        <div className="flex items-center text-lg text-text-secondary mb-2">
          <Award className="h-5 w-5 mr-2" />
          <span>Total Rewards Earned</span>
        </div>
        <p className="text-4xl font-bold text-primary">
          {totalRewards.toFixed(2)} Tokens
        </p>
      </div>

      {/* 历史记录列表 */}
      <div>
        <h2 className="text-xl font-bold mb-4">Minting History</h2>
        <div className="space-y-4">
          {mintedHistory.length > 0 ? (
            mintedHistory.map((item) => (
              <div
                key={item.conversationId}
                className="bg-card p-4 rounded-lg shadow-sm border border-border flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center text-text-primary font-semibold">
                    <BotMessageSquare className="h-5 w-5 mr-2 text-text-secondary" />
                    <Link
                      to={`/chat/${item.conversationId}`}
                      className="hover:underline"
                    >
                      {getConversationTitle(item.conversationId)}
                    </Link>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    Minted on: {new Date(item.timestamp).toLocaleString()}
                  </p>
                  <a
                    href={`https://ipfs.io/ipfs/${item.metadataUrl.replace(
                      "ipfs://",
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center mt-1"
                  >
                    View on IPFS <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
                <div className="text-right">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default MintHistory;
