/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { ArrowLeft, ShoppingBag, Search, Sparkles, Coins } from "lucide-react";
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

import { useWriteContract, useReadContract, usePublicClient } from "wagmi";
import { parseEther } from "viem";
import {
  MARKETPLACE_ADDRESS,
  MARKETPLACE_ABI,
  DATATOKEN_ADDRESS,
  ERC20_ABI,
} from "../constants/contracts";

const Marketplace = () => {
  const [mintedHistory, setMintedHistory] = useAtom(mintedHistoryAtom);
  const setTransactions = useSetAtom(transactionsAtom);
  const conversations = useAtomValue(conversationsAtom);
  const userAddress = useAtomValue(userAddressAtom);

  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const { data: activeListings } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: "getActiveListings",
  });

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
  }, [mintedHistory, conversations, searchTerm]);

  const handleMintTokens = async () => {
    if (!userAddress) {
      toast.error("Please connect wallet first.");
      return;
    }
    const toastId = toast.loading("Minting 100 DTK...");
    try {
      const hash = await writeContractAsync({
        address: DATATOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "mint",
        args: [userAddress, parseEther("100")],
      });

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }

      toast.update(toastId, {
        render: "Success! You received 100 DTK.",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (e) {
      console.error(e);
      toast.update(toastId, {
        render: "Mint failed.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleBuy = async (item: (typeof mintedHistory)[0]) => {
    if (!userAddress) {
      toast.error("Please connect wallet to purchase.");
      return;
    }

    if (!publicClient) {
      toast.error("Network client not ready.");
      return;
    }

    setPurchasingId(item.id);
    const toastId = toast.loading("Starting purchase process...");

    try {
      const priceInWei = parseEther(item.price?.toString() || "0");

      let targetListingId = BigInt(1);
      if (item.listingId) {
        targetListingId = BigInt(item.listingId);
      } else if (
        activeListings &&
        Array.isArray(activeListings) &&
        activeListings.length > 0
      ) {
        targetListingId = activeListings[activeListings.length - 1];
      }

      console.log(`Buying Listing ID: ${targetListingId}`);

      console.log("Checking authorized limits...");
      const allowance = await publicClient?.readContract({
        address: DATATOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [userAddress, MARKETPLACE_ADDRESS],
      });
      console.log(`Current authorized limit: ${allowance?.toString()}`);
      console.log(`Amount to be paid: ${priceInWei.toString()}`);

      if (allowance && allowance < priceInWei) {
        console.log("Insufficient credit limit, initiating authorization...");
        const approveHash = await writeContractAsync({
          address: DATATOKEN_ADDRESS,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [MARKETPLACE_ADDRESS, priceInWei],
        });
        await publicClient?.waitForTransactionReceipt({ hash: approveHash });
        console.log("Authorization complete.");
      } else {
        console.log(
          "The credit limit is sufficient; skip the authorization and purchase directly."
        );
      }

      toast.update(toastId, {
        render: "Step 2/2: Confirming purchase...",
        isLoading: true,
      });

      const txHash = await writeContractAsync({
        address: MARKETPLACE_ADDRESS,
        abi: MARKETPLACE_ABI,
        functionName: "purchaseAccess",
        args: [targetListingId],
      });

      await publicClient.waitForTransactionReceipt({ hash: txHash });

      console.log("Purchase Tx:", txHash);

      const newTransaction = {
        id: `tx-${Date.now()}`,
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
            ? {
                ...h,
                ownerAddress: userAddress,
                isListed: false,
                isSold: true,
                txHash: txHash,
              }
            : h
        )
      );

      toast.update(toastId, {
        render: "Purchase successful! Asset transferred.",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error: any) {
      console.error("Purchase error:", error);
      const errorMessage =
        error.shortMessage || error.message || "Transaction failed";
      toast.update(toastId, {
        render: `Failed: ${errorMessage}`,
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
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              Explore Assets
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <p className="text-text-secondary">
                Discover and purchase tokenized data.
              </p>
              {userAddress && (
                <button
                  onClick={handleMintTokens}
                  className="flex items-center px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
                  title="Mint 100 Test DTK Tokens"
                >
                  <Coins size={12} className="mr-1" />
                  Get Test DTK
                </button>
              )}
            </div>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-primary focus:ring-0 outline-none transition-colors text-base md:text-sm"
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

                const isMine = userAddress && item.ownerAddress === userAddress;

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
                    className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 hover:border-primary/30 transition-colors duration-200 group flex flex-col will-change-transform"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-teal-100 flex items-center justify-center text-primary">
                        <Sparkles size={18} />
                      </div>
                      <span className="px-2 py-1 bg-gray-50 text-xs font-semibold text-gray-500 rounded-md border border-gray-100">
                        Listed {item.listingId ? `#${item.listingId}` : ""}
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
                          {item.price} DTK
                        </span>
                      </div>

                      <button
                        onClick={() => handleBuy(item)}
                        disabled={Boolean(purchasingId === item.id || isMine)}
                        className={`
                                            px-4 py-2 text-sm font-semibold rounded-lg transition-colors active:scale-95
                                            ${
                                              isMine
                                                ? "bg-gray-100 text-gray-400 cursor-default"
                                                : "bg-text-primary text-white hover:bg-black disabled:opacity-70 disabled:cursor-not-allowed"
                                            }
                                        `}
                      >
                        {purchasingId === item.id
                          ? "..."
                          : isMine
                          ? "Yours"
                          : "Buy"}
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
