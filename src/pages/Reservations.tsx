import React, { useState, useEffect } from 'react';
import type { Reservation } from '../types';

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reservations');
      const data = await response.json();
      setReservations(data.data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        const response = await fetch(`/api/reservations/${reservationId}/cancel`, {
          method: 'PUT'
        });

        if (response.ok) {
          fetchReservations();
        }
      } catch (error) {
        console.error('Error cancelling reservation:', error);
      }
    }
  };

  const filteredReservations = reservations.filter(reservation =>
    statusFilter === 'all' || reservation.status === statusFilter
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900">Book Reservations</h1> */}
          <p className="text-gray-600">Manage book reservations and waiting lists</p>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Reservations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReservations.map((reservation) => (
          <div key={reservation._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                {reservation.book?.title}
              </h3>
              <span className={getStatusBadge(reservation.status)}>
                {reservation.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>User:</span>
                <span className="font-medium">{reservation.user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Reserved:</span>
                <span>{new Date(reservation.reservedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Expires:</span>
                <span>{new Date(reservation.expiryDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="text-blue-600">{reservation.user?.email}</span>
              </div>
            </div>

            {reservation.status === 'active' && (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleCancelReservation(reservation._id)}
                  className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded text-sm hover:bg-red-200 transition-colors"
                >
                  Cancel Reservation
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">⏰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
          <p className="text-gray-500">
            {statusFilter !== 'all' 
              ? `No ${statusFilter} reservations at the moment.`
              : 'No reservations have been made yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Reservations;