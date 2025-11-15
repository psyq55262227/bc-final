import { useWallet } from "../../hooks/useWallet";
import { Link2, Link2Off } from "lucide-react";
import type { FC } from "react";

interface ConnectWalletButtonProps {
  isMobile?: boolean;
}

const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({
  isMobile = false,
}) => {
  const { address, connectWallet, disconnectWallet } = useWallet();

  if (address) {
    const text = "Disconnect";
    const icon = <Link2Off className="h-4 w-4" />;
    const classes = "bg-red-600 hover:bg-red-700 text-white";

    if (isMobile) {
      return (
        <button
          onClick={disconnectWallet}
          className="flex items-center justify-center h-10 w-10 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          aria-label="Disconnect Wallet"
        >
          <Link2Off size={24} />
        </button>
      );
    }
    return (
      <button
        onClick={disconnectWallet}
        className={`flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${classes}`}
      >
        {icon}
        <span className="ml-2">{text}</span>
      </button>
    );
  } else {
    const classes = "bg-blue-600 hover:bg-blue-700 text-white";

    if (isMobile) {
      return (
        <button
          onClick={connectWallet}
          className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          aria-label="Connect Wallet"
        >
          <Link2 size={24} />
        </button>
      );
    }
    return (
      <button
        onClick={connectWallet}
        className={`flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${classes}`}
      >
        <Link2 className="h-4 w-4" />
        <span className="ml-2">Connect Wallet</span>
      </button>
    );
  }
};

export default ConnectWalletButton;
