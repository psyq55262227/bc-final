import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, X } from "lucide-react";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConnectWalletModal: FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-sm p-6 bg-white rounded-xl border border-border shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 rounded-full text-text-secondary hover:bg-gray-100"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="p-3 mb-4 bg-primary/10 rounded-full">
                <Wallet className="h-8 w-8 text-primary" />
              </div>

              <h2 className="text-xl font-bold text-text-primary mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-text-secondary mb-6">
                You need to connect a wallet before you can mint your
                conversation as an asset.
              </p>

              <div className="flex w-full space-x-3">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2.5 font-semibold text-text-secondary bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="w-full px-4 py-2.5 font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Connect
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConnectWalletModal;
