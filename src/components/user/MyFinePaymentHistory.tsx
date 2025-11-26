import React from "react";
import type { FinePayment } from "../../validation/fineSchema";

interface FinePaymentHistoryProps {
  fines: FinePayment[];
}

const FinePaymentHistory: React.FC<FinePaymentHistoryProps> = ({ fines }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment History</h2>

      {/* Empty State */}
      {fines.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow">
          <div className="text-gray-400 text-6xl mb-4">💰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No payment history
          </h3>
          <p className="text-gray-500">
            Fine payments will appear here after processing.
          </p>
        </div>
      ) : (
        /* GRID LAYOUT FOR CARDS */
        <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-6">
          {fines.map((fine) => (
            <div
              key={fine._id}
              className="bg-white rounded-xl shadow p-5 border hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Book Title
                  </p>
                  <h3 className="font-bold text-lg text-gray-900">
                    {fine.borrowId.bookId.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {fine.borrowId.bookId.author}
                  </p>
                </div>

                {/* Amount Paid */}
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold whitespace-nowrap">
                  ₹{fine.amount.toFixed(2)}
                </span>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm bg-gray-50 p-3 rounded-lg">
                <p>
                  <span className="font-medium text-gray-600">
                    Payment Method:
                  </span>{" "}
                  <span className="capitalize">{fine.method}</span>
                </p>

                <p>
                  <span className="font-medium text-gray-600">
                    Payment Date:
                  </span>{" "}
                  {new Date(fine.paymentDate).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinePaymentHistory;
