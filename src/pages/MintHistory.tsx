/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAtom, useAtomValue } from "jotai";
import { Link } from "react-router-dom";
import { type ReactNode, type FC, useMemo, useState, useEffect } from "react";
import {
  BadgeDollarSign,
  BotMessageSquare,
  Package,
  Store,
  Settings,
  Sparkles,
} from "lucide-react";
import {
  mintedHistoryAtom,
  conversationsAtom,
  userAddressAtom,
  transactionsAtom,
} from "../state/atoms";
import { motion } from "framer-motion";
import PriceInputModal from "../components/common/PriceInputModal";
import { toast } from "react-toastify";
import { setAssetPrice, toggleListing } from "../api";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  colorClass: string;
}

const StatCard: FC<StatCardProps> = ({ icon, title, value, colorClass }) => (
  <div
    className={`
      p-3 rounded-2xl border flex flex-col items-center justify-center text-center
      md:p-6 md:flex-row md:items-center md:text-left md:justify-start md:space-x-4
      ${colorClass}
    `}
  >
    <div className="p-2 rounded-lg bg-white/60 mb-1.5 md:mb-0">
      <div className="[&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-6 md:[&>svg]:h-6">
        {icon}
      </div>
    </div>

    <div className="flex flex-col md:items-start">
      <p className="text-lg md:text-2xl font-bold leading-none tracking-tight">
        {value}
      </p>
      <p className="text-[10px] md:text-xs font-bold opacity-70 mt-0.5 md:mt-1 uppercase tracking-wide truncate max-w-[80px] md:max-w-none">
        {title}
      </p>
    </div>
  </div>
);

const MintHistory = () => {
  const [mintedHistory, setMintedHistory] = useAtom(mintedHistoryAtom);
  const transactions = useAtomValue(transactionsAtom);
  const conversations = useAtomValue(conversationsAtom);
  const [userAddress] = useAtom(userAddressAtom);

  const [isHydrated, setIsHydrated] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    price: number;
  } | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const myAssets = useMemo(() => {
    if (!userAddress) return [];
    return mintedHistory.filter((item) => item.ownerAddress === userAddress);
  }, [mintedHistory, userAddress]);

  const totalRevenue = useMemo(() => {
    if (!userAddress) return 0;
    return transactions
      .filter((t) => t.sellerAddress === userAddress)
      .reduce((sum, t) => sum + t.price, 0);
  }, [transactions, userAddress]);

  const totalAssetsCount = myAssets.length;

  const listedAssetsCount = myAssets.filter((item) => item.isListed).length;

  const getConversationTitle = (id: string | undefined) => {
    if (!id) return "Invalid Conversation";
    return (
      conversations.find((c) => c.id === id)?.title || "Deleted Conversation"
    );
  };

  const handlePriceUpdate = async (price: number) => {
    if (!editingItem) return;
    try {
      await setAssetPrice(editingItem.id, price);
      setMintedHistory((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, price } : item
        )
      );
      toast.success("Price updated successfully");
    } catch (error) {
      toast.error("Failed to update price");
    }
  };

  const handleToggleList = async (item: (typeof mintedHistory)[0]) => {
    if (!item.price || item.price <= 0) {
      toast.warn("Please set a price before listing.");
      setEditingItem({ id: item.id, price: item.price || 0 });
      return;
    }
    const newStatus = !item.isListed;
    const toastId = toast.loading(
      newStatus ? "Listing on marketplace..." : "Unlisting..."
    );
    try {
      await toggleListing(item.id, newStatus);
      setMintedHistory((prev) =>
        prev.map((h) => (h.id === item.id ? { ...h, isListed: newStatus } : h))
      );
      toast.update(toastId, {
        render: newStatus ? "Item Listed!" : "Item Unlisted",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Operation failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <motion.div
      className="p-4 md:p-8 h-full w-full overflow-y-auto custom-scrollbar bg-chat-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: isHydrated ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="mb-6 md:mb-8 hidden md:block">
        <h1 className="text-2xl font-bold text-text-primary mb-1">My Assets</h1>
        <p className="text-text-secondary text-sm">
          Manage your tokenized conversations and earnings.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
        <StatCard
          icon={<BadgeDollarSign className="text-emerald-600" />}
          title="Revenue"
          value={`$${totalRevenue.toFixed(0)}`}
          colorClass="bg-emerald-50/80 border-emerald-100 text-emerald-800"
        />
        <StatCard
          icon={<Package className="text-blue-600" />}
          title="Assets"
          value={totalAssetsCount.toString()}
          colorClass="bg-blue-50/80 border-blue-100 text-blue-800"
        />
        <StatCard
          icon={<Store className="text-purple-600" />}
          title="Listed"
          value={listedAssetsCount.toString()}
          colorClass="bg-purple-50/80 border-purple-100 text-purple-800"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Asset List</h2>
          <Link
            to="/market"
            className="text-sm font-semibold text-primary hover:underline md:hidden"
          >
            Go to Market
          </Link>
        </div>

        <div className="space-y-3 pb-24 md:pb-10">
          {isHydrated && userAddress ? (
            myAssets.length > 0 ? (
              myAssets.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between hover:border-primary/30 transition-all shadow-sm md:shadow-none"
                >
                  <div className="flex items-start md:items-center overflow-hidden w-full md:w-auto">
                    <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center mr-4 flex-shrink-0 border border-gray-100 text-gray-400">
                      <BotMessageSquare size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/mint-history/${item.id}`}
                          className="font-bold text-text-primary hover:text-primary truncate block text-base"
                        >
                          {getConversationTitle(item.conversationId)}
                        </Link>
                        {item.isListed && (
                          <span className="flex items-center px-1.5 py-0.5 bg-green-100 text-green-700 rounded-md text-[10px] font-bold uppercase tracking-wide border border-green-200">
                            <Sparkles size={10} className="mr-1" /> Listed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary mt-1 flex items-center gap-2">
                        <span>
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>{item.messageIds.length} msgs</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center w-full md:w-auto mt-4 pt-3 border-t border-gray-50 md:mt-0 md:pt-0 md:border-t-0 justify-start md:justify-end gap-3">
                    <div className="flex flex-col items-start md:items-end mr-2">
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                        Selling Price
                      </span>
                      <span className="font-bold text-text-primary text-base">
                        {item.price && item.price > 0 ? `$${item.price}` : "--"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 ml-auto md:ml-0">
                      <button
                        onClick={() =>
                          setEditingItem({
                            id: item.id,
                            price: item.price || 0,
                          })
                        }
                        className="p-2.5 text-text-secondary hover:text-primary bg-gray-50 hover:bg-primary/10 rounded-xl transition-colors"
                        title="Set Price"
                      >
                        <Settings size={18} />
                      </button>

                      <button
                        onClick={() => handleToggleList(item)}
                        className={`
                                px-4 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center min-w-[90px] justify-center
                                ${
                                  item.isListed
                                    ? "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
                                    : "bg-text-primary text-white hover:bg-black border border-transparent"
                                }
                                ${
                                  (!item.price || item.price <= 0) &&
                                  !item.isListed
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }
                            `}
                      >
                        <Store size={16} className="mr-2" />
                        {item.isListed ? "Unlist" : "List"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl border-dashed mx-2 md:mx-0">
                <div className="inline-flex p-4 rounded-full bg-gray-50 mb-4 text-gray-400">
                  <BotMessageSquare size={32} />
                </div>
                <h3 className="text-lg font-bold text-text-primary">
                  No assets yet
                </h3>
                <p className="text-text-secondary mt-1 mb-6 text-sm max-w-xs mx-auto">
                  Chat with the AI and mint your conversations to see them here.
                </p>
                <Link
                  to="/chat"
                  className="px-6 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                >
                  Start Chatting
                </Link>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-text-secondary px-8">
                Please connect your wallet to view your assets.
              </p>
            </div>
          )}
        </div>
      </div>

      <PriceInputModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onConfirm={handlePriceUpdate}
        currentPrice={editingItem?.price}
      />
    </motion.div>
  );
};

export default MintHistory;
