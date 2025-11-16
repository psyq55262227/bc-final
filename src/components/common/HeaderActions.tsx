import { useAtom } from "jotai";
import { isMintingAtom } from "../../state/atoms";
import MintButton from "./MintButton";
import { useMediaQuery } from "react-responsive";
import type { FC } from "react";

interface HeaderActionsProps {
  onMint: () => void;
  isSelectionEmpty: boolean;
  activeConvoExists: boolean;
}

const HeaderActions: FC<HeaderActionsProps> = ({
  onMint,
  isSelectionEmpty,
  activeConvoExists,
}) => {
  const [isMinting] = useAtom(isMintingAtom);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <div className="flex items-center space-x-2">
      {activeConvoExists && (
        <MintButton
          onClick={onMint}
          isLoading={isMinting}
          isDisabled={isMinting || isSelectionEmpty}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default HeaderActions;
