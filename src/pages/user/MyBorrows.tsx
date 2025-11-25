import React, { useEffect, useState } from "react";
import { api } from "../../congif/api";

import {
  BorrowListSchema,
  type Borrow,
} from "../../validation/borrowBookSchema";

import { LoadingOverlay } from "../../components/common/LoadingOverlay";
import { GlobalError } from "../../components/common/GlobalError";

const MyBorrows: React.FC = () => {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = "6923fdc88ec3f845a24f4a35";

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/borrows/user/${userId}`);
      const parsed = BorrowListSchema.parse(res.data);

      setBorrows(parsed);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN");
  };

  const getStatusColor = (status: Borrow["status"]) => {
    switch (status) {
      case "issued":
        return "bg-blue-100 text-blue-700";
      case "returned":
        return "bg-green-100 text-green-700";
      case "late":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (error) return <GlobalError message={error} onRetry={loadPageData} />;

  return (
    <div className="space-y-6 relative">
      {loading && <LoadingOverlay />}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">My Borrowed Books</h2>
        <p className="text-gray-600 text-sm">Track your borrowed books</p>
      </div>

      {/* CARDS */}
      {borrows.map((borrow) => {
        return (
          <div
            key={borrow._id}
            className="bg-white rounded-2xl border lg:w-100 shadow-lg  p-3 space-y-5 transition duration-200 hover:shadow-xl hover:-translate-y-1"
          >
            {/* HEADER */}
            <div className="flex gap-4">
              {/* Book Cover Placeholder */}
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs shadow-inner">
                COVER
              </div>

              <div className="flex flex-col justify-center">
                <h3 className="font-bold text-xl">{borrow.bookId.title}</h3>
                <p className="text-sm text-gray-600">{borrow.bookId.author}</p>
              </div>
            </div>

            {/* DATES */}
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-2 rounded-xl">
              <p>
                <span className="font-medium text-gray-600">Issued:</span>{" "}
                {formatDate(borrow.issueDate)}
              </p>
              <p>
                <span className="font-medium text-gray-600">Due:</span>{" "}
                {formatDate(borrow.dueDate)}
              </p>

              {borrow.returnDate && (
                <p className="col-span-2">
                  <span className="font-medium text-gray-600">Returned:</span>{" "}
                  {formatDate(borrow.returnDate)}
                </p>
              )}
            </div>

            {/* STATUS BADGE */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  borrow.status
                )}`}
              >
                {borrow.status.toUpperCase()}
              </span>

              {borrow.fine > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                  Fine: ₹{borrow.fine}
                </span>
              )}
            </div>

            {/* ACTION BUTTON */}
            <div>
              <button
                className={`w-full py-2 rounded-lg font-semibold text-white transition bg-blue-600 hover:bg-blue-700 cursor-pointer`}
              >
                Renew Book
              </button>
            </div>
          </div>
        );
      })}

      {/* EMPTY STATE */}
      {borrows.length === 0 && (
        <p className="text-center text-gray-500 py-6">
          You have no borrow history yet.
        </p>
      )}
    </div>
  );
};

export default MyBorrows;
