import { type FC, useEffect, useRef } from "react";
import { useWallet } from "../hooks/useWallet";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, LogOut } from "lucide-react";

const MetamaskIcon = () => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
    alt="Metamask"
    className="h-8 w-8 md:h-10 md:w-10"
  />
);
const CoinbaseWalletIcon = () => (
  <div className="h-8 w-8 md:h-10 md:w-10 bg-blue-600 rounded-full" />
);
const WalletConnectIcon = () => (
  <div className="h-8 w-8 md:h-10 md:w-10 bg-blue-400 rounded-full" />
);
const FortmaticIcon = () => (
  <div className="h-8 w-8 md:h-10 md:w-10 bg-purple-600 rounded-full" />
);
const TrezorIcon = () => (
  <div className="h-8 w-8 md:h-10 md:w-10 bg-gray-800 rounded-full" />
);
const LedgerIcon = () => (
  <div className="h-8 w-8 md:h-10 md:w-10 bg-black rounded-full" />
);

interface Wallet {
  name: string;
  icon: FC;
  action: () => void;
  disabled?: boolean;
}

const WalletButton: FC<{ wallet: Wallet }> = ({ wallet }) => (
  <motion.button
    onClick={wallet.action}
    disabled={wallet.disabled}
    className="flex flex-row items-center p-4 border border-border rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
               md:flex-col md:justify-center md:p-4 md:space-y-3"
    variants={{
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
    }}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
  >
    <wallet.icon />
    <span className="text-base font-medium text-text-primary ml-4 md:ml-0">
      {wallet.name}
    </span>
  </motion.button>
);

const ConnectWalletPage = () => {
  const { connectWallet, disconnectWallet, address } = useWallet();
  const navigate = useNavigate();

  const prevAddressRef = useRef(address);
  useEffect(() => {
    if (!prevAddressRef.current && address) {
      const timer = setTimeout(() => {
        navigate(-1);
      }, 1500);
      return () => clearTimeout(timer);
    }
    prevAddressRef.current = address;
  }, [address, navigate]);

  const wallets: Wallet[] = [
    { name: "Metamask", icon: MetamaskIcon, action: connectWallet },
    {
      name: "Coinbase Wallet",
      icon: CoinbaseWalletIcon,
      action: () => toast.info("Coinbase Wallet is not supported yet."),
      disabled: true,
    },
    {
      name: "Wallet Connect",
      icon: WalletConnectIcon,
      action: () => toast.info("Wallet Connect is not supported yet."),
      disabled: true,
    },
    {
      name: "Fortmatic",
      icon: FortmaticIcon,
      action: () => toast.info("Fortmatic is not supported yet."),
      disabled: true,
    },
    {
      name: "Trezor",
      icon: TrezorIcon,
      action: () => toast.info("Trezor is not supported yet."),
      disabled: true,
    },
    {
      name: "Ledger",
      icon: LedgerIcon,
      action: () => toast.info("Ledger is not supported yet."),
      disabled: true,
    },
  ];

  if (address) {
    return (
      <div className="h-full p-4 md:p-8 bg-background overflow-y-auto custom-scrollbar">
        <motion.div
          className="w-full bg-card p-8 rounded-xl border border-border text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-md mx-auto py-18">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-text-primary">
              Wallet Connected
            </h2>
            <p className="text-text-secondary mb-4">
              You will be redirected shortly.
            </p>
            {/* <p className="text-sm text-green-700 font-mono break-all bg-green-50 p-4 rounded-md mb-6">
              {address}
            </p> */}
            <button
              onClick={disconnectWallet}
              className="flex items-center justify-center mx-auto p-4 px-16 text-sm font-semibold text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 md:p-8 bg-background overflow-y-auto custom-scrollbar">
      <header className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold mb-2">Connect your wallet</h1>
        <p className="text-text-secondary">
          Select what wallet you want to connect below
        </p>
      </header>
      <motion.div
        className="w-full bg-card p-6 md:p-8 rounded-xl border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <motion.div
            className="flex flex-col space-y-3 md:grid md:grid-cols-3 md:gap-4 md:space-y-0"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
            initial="hidden"
            animate="visible"
          >
            {wallets.map((wallet) => (
              <WalletButton key={wallet.name} wallet={wallet} />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConnectWalletPage;
