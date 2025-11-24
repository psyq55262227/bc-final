/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { ArrowLeft, ShoppingBag, Search, Sparkles } from "lucide-react";
import {
  mintedHistoryAtom,
  conversationsAtom,
  userAddressAtom,
  transactionsAtom,
} from "../state/atoms";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ConnectWalletButton from "../components/common/ConnectWalletButton";
import { useMediaQuery } from "react-responsive";
import { buyAsset } from "../api";

const Marketplace = () => {
  const [mintedHistory, setMintedHistory] = useAtom(mintedHistoryAtom);
  const setTransactions = useSetAtom(transactionsAtom);
  const conversations = useAtomValue(conversationsAtom);
  const userAddress = useAtomValue(userAddressAtom);

  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  // 过滤逻辑：已上架 + 不是自己的
  const marketItems = useMemo(() => {
    return mintedHistory
      .filter((item) => {
        if (!item.isListed) return false;
        if (!item.price || item.price <= 0) return false;
        return true;
      })
      .filter((item) => {
        const title =
          conversations.find((c) => c.id === item.conversationId)?.title || "";
        return title.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [mintedHistory, userAddress, conversations, searchTerm]);

  const handleBuy = async (item: (typeof mintedHistory)[0]) => {
    if (!userAddress) {
      toast.error("Please connect wallet to purchase.");
      return;
    }

    setPurchasingId(item.id);
    const toastId = toast.loading("Processing payment...");

    try {
      await buyAsset(item.id, userAddress);

      const newTransaction = {
        id: self.crypto.randomUUID(),
        assetId: item.id,
        sellerAddress: item.ownerAddress || "system",
        buyerAddress: userAddress,
        price: item.price || 0,
        timestamp: Date.now(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);

      setMintedHistory((prev) =>
        prev.map((h) =>
          h.id === item.id
            ? { ...h, ownerAddress: userAddress, isListed: false }
            : h
        )
      );

      toast.update(toastId, {
        render: `Purchased successfully for $${item.price}!`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Purchase failed.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold text-text-primary">Market</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ConnectWalletButton isMobile={isMobile} />
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="hidden md:block">
            <h2 className="text-2xl font-bold text-text-primary">
              Explore Assets
            </h2>
            <p className="text-text-secondary mt-1">
              Discover and purchase tokenized conversation data.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-primary focus:ring-0 outline-none transition-colors text-sm"
            />
          </div>
        </div>

        {marketItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">
              No items found
            </h3>
            <p className="text-text-secondary mt-1 max-w-sm">
              {searchTerm
                ? "Try adjusting your search terms."
                : "The marketplace is currently empty."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {marketItems.map((item, index) => {
                const convo = conversations.find(
                  (c) => c.id === item.conversationId
                );
                const title = convo?.title || "Unknown Asset";
                const preview =
                  convo?.messages[0]?.content.substring(0, 100) + "..." || "";

                return (
                  <motion.div
                    key={item.id}
                    layout="position"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      mass: 1,
                      delay: index * 0.05,
                    }}
                    className="bg-white rounded-2xl p-6 md:p-5 border border-gray-100 hover:border-primary/30 transition-colors duration-200 group flex flex-col will-change-transform"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-teal-100 flex items-center justify-center text-primary">
                        <Sparkles size={18} />
                      </div>
                      <span className="px-2 py-1 bg-gray-50 text-xs font-semibold text-gray-500 rounded-md border border-gray-100">
                        Listed
                      </span>
                    </div>

                    <h3 className="text-base md:text-lg font-bold text-text-primary line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-3 flex-1 h-[40px]">
                      {preview}
                    </p>

                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                          Price
                        </span>
                        <span className="text-lg font-bold text-text-primary">
                          ${item.price}
                        </span>
                      </div>

                      <button
                        onClick={() => handleBuy(item)}
                        disabled={purchasingId === item.id}
                        className="px-4 py-2 bg-text-primary text-white text-sm font-semibold rounded-lg hover:bg-black transition-colors active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {purchasingId === item.id ? "..." : "Buy"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default Marketplace;
