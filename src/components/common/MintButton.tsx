import { Sparkles } from "lucide-react";
import type { FC } from "react";
interface MintButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  isMobile?: boolean;
}

const MintButton: FC<MintButtonProps> = ({
  onClick,
  isLoading,
  isDisabled,
  isMobile = false,
}) => {
  const finalIsDisabled = isDisabled || isLoading;
  let buttonText = "Mint Selected";
  if (isLoading) buttonText = "Minting...";

  const disabledTooltip =
    "Connect wallet and select one or more messages to mint.";

  const buttonContent = (
    <>
      <Sparkles
        className={`h-4 w-4 ${isLoading ? "animate-spin" : ""} ${
          !isMobile ? "mr-2" : ""
        }`}
      />
      {!isMobile && <span>{buttonText}</span>}
    </>
  );

  const buttonClasses = isMobile
    ? `flex items-center justify-center h-8 w-8 rounded-lg text-white
           bg-primary hover:bg-primary/90
           disabled:bg-gray-400 disabled:text-white`
    : `flex items-center px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg
           disabled:bg-gray-400 hover:bg-primary/90`;

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        disabled={finalIsDisabled}
        className={`transition-colors disabled:cursor-not-allowed ${buttonClasses}`}
        aria-label={isMobile ? buttonText : undefined}
      >
        {buttonContent}
      </button>
      {isDisabled && !isLoading && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-700 rounded-md
                               invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
        >
          {disabledTooltip}
        </div>
      )}
    </div>
  );
};

export default MintButton;
