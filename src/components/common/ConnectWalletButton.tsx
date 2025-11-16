import type { FC } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link2, Link2Off } from "lucide-react";

interface ConnectWalletButtonProps {
  isMobile?: boolean;
}

const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({
  isMobile = false,
}) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected = ready && account && chain;

        if (!ready) {
          return null;
        }

        if (!connected) {
          if (isMobile) {
            return (
              <button
                onClick={openConnectModal}
                className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                aria-label="Connect Wallet"
              >
                <Link2 size={16} />
              </button>
            );
          }
          return (
            <button
              onClick={openConnectModal}
              className="flex items-center px-4 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Link2 className="h-4 w-4 mr-2" />
              <span>Connect Wallet</span>
            </button>
          );
        }

        if (isMobile) {
          return (
            <button
              onClick={openAccountModal}
              className="flex items-center justify-center h-8 w-8 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              aria-label="Open account options"
            >
              <Link2Off size={16} />
            </button>
          );
        }
        return (
          <button
            onClick={openAccountModal}
            className="flex items-center px-4 py-2 text-sm font-semibold bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          >
            <Link2Off className="h-4 w-4 mr-2" />
            <span>Disconnect</span>
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWalletButton;
