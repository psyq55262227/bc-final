import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSetAtom } from "jotai";
import { userAddressAtom } from "../state/atoms";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const useWallet = () => {
  const { address, isConnected, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();
  const setJotaiAddress = useSetAtom(userAddressAtom);

  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if (isConnected && address) {
      setJotaiAddress(address);
    }
    if (isDisconnected) {
      setJotaiAddress(null);
    }
  }, [address, isConnected, isDisconnected, setJotaiAddress]);

  const connectWallet = () => {
    if (openConnectModal) {
      openConnectModal();
    } else {
      toast.error("Connect modal is not ready yet.");
    }
  };

  const disconnectWallet = () => {
    disconnect();
    toast.info("Wallet disconnected.");
  };

  return {
    address,
    isConnected,
    connectWallet,
    disconnectWallet,
  };
};
