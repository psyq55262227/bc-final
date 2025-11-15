import type { FC } from "react";

interface StatusDotProps {
  isConnected: boolean;
}

const StatusDot: FC<StatusDotProps> = ({ isConnected }) => {
  const bgColor = isConnected ? "bg-green-500" : "bg-red-500";
  return (
    <div
      className={`inline-block w-2.5 h-2.5 rounded-full ${bgColor}`}
      title={isConnected ? "Wallet Connected" : "Wallet Disconnected"}
    ></div>
  );
};

export default StatusDot;
