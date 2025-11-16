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
    const classes = "bg-red-100 hover:bg-red-200 text-red-700 rounded-lg";

    if (isMobile) {
      return (
        <button
          onClick={disconnectWallet}
          className={`flex items-center justify-center h-8 w-8 ${classes}`}
          aria-label="Disconnect Wallet"
        >
          <Link2Off size={16} />
        </button>
      );
    }
    return (
      <button
        onClick={disconnectWallet}
        className={`flex items-center px-3 py-2 text-sm font-semibold transition-colors ${classes}`}
      >
        {icon}
        <span className="ml-2">{text}</span>
      </button>
    );
  } else {
    if (isMobile) {
      return (
        <button
          onClick={connectWallet}
          className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary hover:bg-primary/90 text-white"
          aria-label="Connect Wallet"
        >
          <Link2 size={16} />
        </button>
      );
    }
    return (
      <button
        onClick={connectWallet}
        className={`flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors bg-primary hover:bg-primary/90 text-white`}
      >
        <Link2 className="h-4 w-4" />
        <span className="ml-2">Connect Wallet</span>
      </button>
    );
  }
};

export default ConnectWalletButton;
