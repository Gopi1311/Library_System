import React, { useState, useEffect } from "react";
import type { FinePayment, Borrow } from "../types";
import FinePaymentHistory from "../components/fines/FinePaymentHistory";
import FinePaymentForm from "../components/fines/FinePaymentForm";

const Fines: React.FC = () => {
  const [fines, setFines] = useState<FinePayment[]>([]);
  const [outstandingFines, setOutstandingFines] = useState<Borrow[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState<Borrow | null>(null);
  const [loading, setLoading] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    method: "cash",
    amount: 0,
  });

  useEffect(() => {
    fetchFines();
    fetchOutstandingFines();
  }, []);

  const fetchFines = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fines/history");
      const data = await response.json();
      setFines(data.data || []);
    } catch (error) {
      console.error("Error fetching fines:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOutstandingFines = async () => {
    try {
      const response = await fetch("/api/borrow/history");
      const data = await response.json();
      const outstanding = (data.borrowDetails || []).filter(
        (borrow: Borrow) => borrow.fine > 0 && borrow.status !== "returned"
      );
      setOutstandingFines(outstanding);
    } catch (error) {
      console.error("Error fetching outstanding fines:", error);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBorrow) return;

    try {
      const response = await fetch("/api/fines/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedBorrow.userId,
          borrowId: selectedBorrow._id,
          amount: paymentForm.amount,
          method: paymentForm.method,
        }),
      });

      if (response.ok) {
        setShowPaymentForm(false);
        setSelectedBorrow(null);
        setPaymentForm({ method: "cash", amount: 0 });
        fetchFines();
        fetchOutstandingFines();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const openPaymentForm = (borrow: Borrow) => {
    setSelectedBorrow(borrow);
    setPaymentForm({
      method: "cash",
      amount: borrow.fine,
    });
    setShowPaymentForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        {/* <h1 className="text-2xl font-bold text-gray-900">Fine Management</h1> */}
        <p className="text-gray-600">
          Manage outstanding fines and payment history
        </p>
      </div>

      {/* Outstanding Fines */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Outstanding Fines</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User & Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fine Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {outstandingFines.map((borrow) => (
                  <tr key={borrow._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {borrow.user?.name || "Unknown User"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {borrow.book?.title || "Unknown Book"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(borrow.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-red-600">
                      ${borrow.fine.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button
                        onClick={() => openPaymentForm(borrow)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Process Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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

      {/* Payment History */}
      <FinePaymentHistory fines={fines} />

      {/* Payment Form Modal */}
      {showPaymentForm && selectedBorrow && (
        <FinePaymentForm
          selectedBorrow={selectedBorrow}
          paymentForm={paymentForm}
          setPaymentForm={setPaymentForm}
          onCancel={() => {
            setShowPaymentForm(false);
            setSelectedBorrow(null);
          }}
          onSubmit={handlePayment}
        />
      )}
    </div>
  );
};

export default Fines;
