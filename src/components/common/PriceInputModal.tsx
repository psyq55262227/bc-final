import { useState, type FC, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, X } from "lucide-react";

interface PriceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (price: number) => void;
  currentPrice?: number;
}

const PriceInputModal: FC<PriceInputModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentPrice = 0,
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setInputValue(currentPrice > 0 ? currentPrice.toString() : "");
    }
  }, [isOpen, currentPrice]);

  const handleConfirm = () => {
    const price = parseFloat(inputValue);
    if (!isNaN(price) && price > 0) {
      onConfirm(price);
      onClose();
    }
  };

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
            className="relative w-full max-w-sm p-6 bg-white rounded-xl border border-border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 rounded-full text-text-secondary hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="p-3 mb-4 bg-primary/10 rounded-full">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>

              <h2 className="text-xl font-bold text-text-primary mb-2">
                Set Asset Price
              </h2>
              <p className="text-text-secondary mb-6 text-sm">
                Enter the amount of tokens you want to sell this conversation
                asset for.
              </p>

              <div className="w-full mb-6">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-primary focus:ring-0 text-lg font-semibold text-text-primary outline-none transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex w-full space-x-3">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2.5 font-semibold text-text-secondary bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!inputValue || parseFloat(inputValue) <= 0}
                  className="w-full px-4 py-2.5 font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PriceInputModal;
