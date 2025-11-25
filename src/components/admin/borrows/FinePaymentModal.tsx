import React from "react";
import type { Borrow } from "../../../validation/borrowBookSchema";

interface FinePaymentProps {
  isOpen: boolean;
  borrow: Borrow | null;
  method: "cash" | "card" | "online";

  onClose: () => void;
  onPay: () => void;
  onMethodChange: (m: "cash" | "card" | "online") => void;
}

const FinePaymentModal: React.FC<FinePaymentProps> = ({
  isOpen,
  borrow,
  method,
  onClose,
  onPay,
  onMethodChange,
}) => {
  if (!isOpen || !borrow) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold text-red-600 mb-3">
          Fine Payment Required
        </h2>

        <p className="text-lg font-semibold mb-4">
          Fine Amount:
          <span className="text-red-600"> ₹{borrow.fine.toFixed(2)}</span>
        </p>

        <select
          value={method}
          onChange={(e) =>
            onMethodChange(e.target.value as "cash" | "card" | "online")
          }
          className="border px-3 py-2 rounded w-full mb-4"
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="online">Online</option>
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>

          <button
            onClick={onPay}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Pay & Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinePaymentModal;
