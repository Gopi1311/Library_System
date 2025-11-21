import React from "react";
import type { Borrow } from "../../types";

interface FinePaymentFormProps {
  selectedBorrow: Borrow;
  paymentForm: { method: string; amount: number };
  setPaymentForm: React.Dispatch<React.SetStateAction<{ method: string; amount: number }>>;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const FinePaymentForm: React.FC<FinePaymentFormProps> = ({
  selectedBorrow,
  paymentForm,
  setPaymentForm,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Process Fine Payment</h2>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between mb-2">
                <span>User:</span>
                <span className="font-medium">{selectedBorrow.user?.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Book:</span>
                <span className="font-medium">{selectedBorrow.book?.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Fine Amount:</span>
                <span className="font-semibold text-red-600">
                  ${selectedBorrow.fine.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                value={paymentForm.method}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, method: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="cash">Cash</option>
                <option value="card">Credit/Debit Card</option>
                <option value="online">Online Payment</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Amount to Pay
              </label>
              <input
                type="number"
                min={0}
                max={selectedBorrow.fine}
                step="0.01"
                value={paymentForm.amount}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    amount: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />

              <p className="text-xs text-gray-500 mt-1">
                Maximum allowed: ${selectedBorrow.fine.toFixed(2)}
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Process Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FinePaymentForm;
