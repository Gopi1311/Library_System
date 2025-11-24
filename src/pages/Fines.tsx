import React, { useState, useEffect } from "react";
import type { FinePayment, Borrow } from "../types";
import { api } from "../congif/api";
import FinePaymentHistory from "../components/fines/FinePaymentHistory";
import { LoadingOverlay } from "../components/common/LoadingOverlay";
import { GlobalError } from "../components/common/GlobalError";

const Fines: React.FC = () => {
  const [fines, setFines] = useState<FinePayment[]>([]);
  const [outstandingFines, setOutstandingFines] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFines = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/fines/history");
      console.log("fine: ", data);

      setFines(data.data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  
  const fetchOutstandingFines = async () => {
    try {
      const { data } = await api.get("/borrows/outstanding");
      const outstanding = (data.data || []).filter(
        (borrow: Borrow) => borrow.fine > 0 && borrow.status !== "returned"
      );
      setOutstandingFines(outstanding);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchFines();
    fetchOutstandingFines();
  }, []);

  if (error) {
    return <GlobalError message={error} onRetry={fetchFines} />;
  }

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="space-y-8">
      <p className="text-gray-600">
        View outstanding fines and payment history
      </p>
      <div>
        <h2 className="text-xl font-semibold mb-4">Outstanding Fines</h2>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fine Amount
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {outstandingFines.map((borrow) => (
                  <tr key={borrow._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {borrow.userId?.name || "Unknown User"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {borrow.bookId?.title || "Unknown Book"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(borrow.dueDate).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-red-600">
                      ₹{borrow.fine.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {outstandingFines.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No outstanding fines
            </h3>
            <p className="text-gray-500">All fines have been paid.</p>
          </div>
        )}
      </div>

      {/* Payment History Section*/}
      <FinePaymentHistory fines={fines} />
    </div>
  );
};

export default Fines;
