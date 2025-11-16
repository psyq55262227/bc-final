import { useAtom } from "jotai";
import { isWalletConnectedAtom, isMintingAtom } from "../../state/atoms";
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
      {activeConvoExists && (
        <MintButton
          onClick={onMint}
          isLoading={isMinting}
          isMinted={isMinted}
          isDisabled={!isWalletConnected}
          isMobile={isMobile}
        />
      )}
      {/* <ConnectWalletButton isMobile={isMobile} /> */}
    </div>
  );
};

export default HeaderActions;
