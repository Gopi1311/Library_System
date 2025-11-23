import React from "react";
import type { FinePayment } from "../../types";

interface FinePaymentHistoryProps {
  fines: FinePayment[];
}

const FinePaymentHistory: React.FC<FinePaymentHistoryProps> = ({ fines }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment History</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {fines.map((fine) => (
                <tr key={fine._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {fine.userId?.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {fine.borrowId?.bookId?.title}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    ${fine.amount.toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-sm capitalize text-gray-900">
                    {fine.method}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(fine.paymentDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {fines.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg">
            <div className="text-gray-400 text-6xl mb-4">💰</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No payment history
            </h3>
            <p className="text-gray-500">
              Fine payments will appear here once processed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinePaymentHistory;
