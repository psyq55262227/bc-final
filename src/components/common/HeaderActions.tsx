import { useAtom } from "jotai";
import { isWalletConnectedAtom, isMintingAtom } from "../../state/atoms";
import ConnectWalletButton from "./ConnectWalletButton";
import MintButton from "./MintButton";
import { useMediaQuery } from "react-responsive";
import type { FC } from "react";

interface HeaderActionsProps {
  onMint: () => void;
  isMinted: boolean;
  activeConvoExists: boolean;
}

const HeaderActions: FC<HeaderActionsProps> = ({
  onMint,
  isMinted,
  activeConvoExists,
}) => {
  const [isWalletConnected] = useAtom(isWalletConnectedAtom);
  const [isMinting] = useAtom(isMintingAtom);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <div className="flex items-center space-x-2">
      {/* The Mint button only shows if a conversation is active */}
      {activeConvoExists && (
        <MintButton
          onClick={onMint}
          isLoading={isMinting}
          isMinted={isMinted}
          isDisabled={!isWalletConnected}
          isMobile={isMobile}
        />
      )}
      {/* The Connect button always shows its current state */}
      <ConnectWalletButton isMobile={isMobile} />
    </div>
  );
};

export default HeaderActions;
