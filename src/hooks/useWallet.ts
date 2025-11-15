/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useAtom } from "jotai";
import { userAddressAtom } from "../state/atoms";
import { ethers } from "ethers";
import { toast } from "react-toastify";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [address, setAddress] = useAtom(userAddressAtom);

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        console.log("User disconnected");
        setAddress(null);
      } else {
        setAddress(accounts[0]);
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [setAddress]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected. Please install it to continue.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        toast.success("Wallet connected successfully!");
      }
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      if (error.code === 4001) {
        toast.warn("You rejected the wallet connection request.");
      } else {
        toast.error("Failed to connect wallet.");
      }
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    toast.info("Wallet disconnected.");
  };

  return { address, connectWallet, disconnectWallet };
};
