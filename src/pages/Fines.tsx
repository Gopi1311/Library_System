import React, { useState, useEffect } from 'react';
import type { FinePayment, Borrow } from '../types';

const Fines: React.FC = () => {
  const [fines, setFines] = useState<FinePayment[]>([]);
  const [outstandingFines, setOutstandingFines] = useState<Borrow[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState<Borrow | null>(null);
  const [loading, setLoading] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    method: 'cash',
    amount: 0
  });

  useEffect(() => {
    fetchFines();
    fetchOutstandingFines();
  }, []);

  const fetchFines = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/fines/history');
      const data = await response.json();
      setFines(data.data || []);
    } catch (error) {
      console.error('Error fetching fines:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOutstandingFines = async () => {
    try {
      const response = await fetch('/api/borrow/history');
      const data = await response.json();
      const outstanding = (data.borrowDetails || []).filter(
        (borrow: Borrow) => borrow.fine > 0 && borrow.status !== 'returned'
      );
      setOutstandingFines(outstanding);
    } catch (error) {
      console.error('Error fetching outstanding fines:', error);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBorrow) return;

    try {
      const response = await fetch('/api/fines/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedBorrow.userId,
          borrowId: selectedBorrow._id,
          amount: paymentForm.amount,
          method: paymentForm.method
        })
      });

      if (response.ok) {
        setShowPaymentForm(false);
        setSelectedBorrow(null);
        setPaymentForm({ method: 'cash', amount: 0 });
        fetchFines();
        fetchOutstandingFines();
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const openPaymentForm = (borrow: Borrow) => {
    setSelectedBorrow(borrow);
    setPaymentForm({
      method: 'cash',
      amount: borrow.fine
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
        <h1 className="text-2xl font-bold text-gray-900">Fine Management</h1>
        <p className="text-gray-600">Manage outstanding fines and payment history</p>
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
                        {borrow.user?.name || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {borrow.book?.title || 'Unknown Book'}
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No outstanding fines</h3>
            <p className="text-gray-500">All fines have been paid.</p>
          </div>
        )}
      </div>

      {/* Payment History */}
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
                      {fine.user?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {fine.borrow?.book?.title}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      ${fine.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">
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
        </div>

        {fines.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <div className="text-gray-400 text-6xl mb-4">💰</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payment history</h3>
            <p className="text-gray-500">Fine payments will appear here once processed.</p>
          </div>
        )}
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && selectedBorrow && (
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
                    <span className="font-semibold text-red-600">${selectedBorrow.fine.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentForm.method}
                    onChange={(e) => setPaymentForm({...paymentForm, method: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="online">Online Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount to Pay
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={selectedBorrow.fine}
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum amount: ${selectedBorrow.fine.toFixed(2)}
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentForm(false);
                      setSelectedBorrow(null);
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Process Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fines;