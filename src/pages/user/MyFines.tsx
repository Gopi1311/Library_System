import React, { useState, useEffect } from "react";
import type { Borrow } from "../../validation/borrowBookSchema";
import type { FinePayment } from "../../validation/fineSchema";
import { api } from "../../congif/api";
import FinePaymentHistory from "../../components/common/FinePaymentHistory";
import { LoadingOverlay } from "../../components/common/LoadingOverlay";
import { GlobalError } from "../../components/common/GlobalError";

const MyFines: React.FC = () => {
  const [fines, setFines] = useState<FinePayment[]>([]);
  const [outstandingFines, setOutstandingFines] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = "6923fdc88ec3f845a24f4a35";

  const fetchFines = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/fines/user/${userId}`);
      setFines(data.data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOutstandingFines = async () => {
    try {
      const { data } = await api.get(`/borrows/user/outstanding/${userId}`);
      console.log("data: ",data);
      
      const outstanding = (data.data || []).filter(
        (b: Borrow) => b.fine > 0 && b.status !== "returned"
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

  if (error) return <GlobalError message={error} onRetry={fetchFines} />;
  if (loading) return <LoadingOverlay />;

  return (
    <div className="space-y-10">

      {/* OUTSTANDING FINES */}
      <div>
        <h2 className="text-xl font-bold mb-4">Outstanding Fines</h2>

        {outstandingFines.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <p className="text-lg font-semibold">No Outstanding Fines</p>
            <p className="text-gray-500">You have no unpaid fines.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outstandingFines.map((b) => (
              <div
                key={b._id}
                className="p-4 bg-white rounded-xl shadow border hover:shadow-md transition"
              >
                <h3 className="text-lg font-bold">{b.bookId.title}</h3>
                <p className="text-sm text-gray-600">{b.bookId.author}</p>

                <div className="mt-3 text-sm">
                  <p>
                    <span className="font-medium text-gray-600">Due:</span>{" "}
                    {new Date(b.dueDate).toLocaleDateString("en-IN")}
                  </p>
                  <p className="font-semibold text-red-600">
                    Fine: ₹{b.fine.toFixed(2)}
                  </p>
                </div>

                <button className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700">
                  Pay Fine
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAYMENT HISTORY */}
      <FinePaymentHistory fines={fines} />
    </div>
  );
};

export default MyFines;
