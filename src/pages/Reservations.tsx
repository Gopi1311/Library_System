import React, { useEffect, useState, useCallback } from "react";
import { api } from "../congif/api";
import type { Reservation, User, Book } from "../types";
import ReserveBookModal from "../components/reservations/ReserveBookModal";
import ReservationCard from "../components/reservations/ReservationCard";
import { LoadingOverlay } from "../components/common/LoadingOverlay";
import { GlobalError } from "../components/common/GlobalError";
import {
  BookOpenIcon,
  XMarkIcon,
  CheckBadgeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

type ReservationStatusFilter = "all" | "active" | "completed" | "cancelled";

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<ReservationStatusFilter>("all");
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const query =
        statusFilter === "all"
          ? ""
          : `?status=${encodeURIComponent(statusFilter)}`;

      const { data } = await api.get(`/reservations${query}`);
      setReservations(data.data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleUserSearch = async (q: string) => {
    setUserSearch(q);
    if (!q.trim()) return setUsers([]);
    try {
      const { data } = await api.get(`/users/search?name=${q}`);
      setUsers(data);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleBookSearch = async (q: string) => {
    setBookSearch(q);
    if (!q.trim()) return setBooks([]);
    try {
      const { data } = await api.get(`/books/search?title=${q}`);
      setBooks(data);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleSubmitReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/reservations", {
        userId: selectedUserId,
        bookId: selectedBookId,
      });

      alert("Book reserved successfully!");

      setShowModal(false);
      setSelectedUserId("");
      setSelectedBookId("");
      setUserSearch("");
      setBookSearch("");
      fetchReservations();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleCancelReservation = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await api.patch(`/reservations/${id}/cancel`);
      fetchReservations();
    } catch (err) {
       alert((err as Error).message)
      // setError((err as Error).message);
    }
  };

  const getStatusConfig = (status: string) => {
    const config = {
      active: {
        class: "bg-blue-50 text-blue-700 border border-blue-200",
        icon: ClockIcon,
        text: "Active",
      },
      completed: {
        class: "bg-green-50 text-green-700 border border-green-200",
        icon: CheckBadgeIcon,
        text: "Completed",
      },
      cancelled: {
        class: "bg-red-50 text-red-700 border border-red-200",
        icon: XMarkIcon,
        text: "Cancelled",
      },
    };

    return (
      config[status as keyof typeof config] || {
        class: "bg-gray-50 text-gray-700 border border-gray-200",
        icon: ClockIcon,
        text: status,
      }
    );
  };

  /* ----------------------------------------
   * Error Page
   * ---------------------------------------- */
  if (error) return <GlobalError message={error} onRetry={fetchReservations} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && <LoadingOverlay />}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
              <p className="mt-2 text-gray-600">
                Manage and track book reservations
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as ReservationStatusFilter)
                  }
                  className="pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <BookOpenIcon className="w-5 h-5 mr-2" />
                Reserve Book
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-xl">
                <ClockIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Reservations
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {reservations.filter((r) => r.status === "active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckBadgeIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reservations.filter((r) => r.status === "completed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-50 rounded-xl">
                <XMarkIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reservations.filter((r) => r.status === "cancelled").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {reservations.map((r) => (
            <ReservationCard
              key={r._id}
              reservation={r}
              statusConfig={getStatusConfig(r.status)}
              onCancel={handleCancelReservation}
            />
          ))}
        </div>

        {/* Empty State */}
        {reservations.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BookOpenIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reservations found
            </h3>
            <p className="text-gray-500 mb-6">
              {statusFilter === "all"
                ? "Get started by creating your first reservation."
                : `No ${statusFilter} reservations found.`}
            </p>
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View all reservations
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reserve Modal */}
      <ReserveBookModal
        isOpen={showModal}
        users={users}
        books={books}
        userSearch={userSearch}
        bookSearch={bookSearch}
        selectedUserId={selectedUserId}
        selectedBookId={selectedBookId}
        onUserSearch={handleUserSearch}
        onBookSearch={handleBookSearch}
        onSelectUser={(u) => {
          setSelectedUserId(u._id);
          setUserSearch(`${u.name} (${u.email})`);
          setUsers([]);
        }}
        onSelectBook={(b) => {
          setSelectedBookId(b._id);
          setBookSearch(`${b.title} — ${b.author}`);
          setBooks([]);
        }}
        onClose={() => {setShowModal(false);setBookSearch("");setUserSearch("")}}
        onSubmit={handleSubmitReserve}
      />
    </div>
  );
};

export default Reservations;
