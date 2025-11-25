import React, { useState, useEffect } from "react";

import { BorrowListSchema } from "../../validation/borrowBookSchema";
import type {
  Borrow,
  IssueBookDTO,
  BorrowUser,
  BorrowBook,
} from "../../validation/borrowBookSchema";
import { api } from "../../congif/api";

import BorrowTableRow from "../../components/admin/borrows/BorrowTableRow";
import IssueBookModal from "../../components/admin/borrows/IssueBookModal";
import FinePaymentModal from "../../components/admin/borrows/FinePaymentModal";

import { LoadingOverlay } from "../../components/common/LoadingOverlay";
import { GlobalError } from "../../components/common/GlobalError";

const Borrows: React.FC = () => {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [users, setUsers] = useState<BorrowUser[]>([]);
  const [books, setBooks] = useState<BorrowBook[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showIssueForm, setShowIssueForm] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  const [showFineModal, setShowFineModal] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState<Borrow | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "online"
  >("cash");

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [b1, b2, b3] = await Promise.all([
        api.get("/borrows/history"),
        api.get("/users"),
        api.get("/books/all"),
      ]);
      const parsed = BorrowListSchema.parse(b1.data.borrowDetails);
      setBorrows(parsed);
      const rawUsers = b2.data;

      setUsers(
        rawUsers.map((u: any) => ({
          _id: u._id,
          name: u.name,
          email: u.email,
        })) as BorrowUser[]
      );

      const rawBooks = b3.data;

      setBooks(
        rawBooks
          .filter((b: any) => b.availableCopies > 0)
          .map((b: any) => ({
            _id: b._id,
            title: b.title,
            author: b.author,
          })) as BorrowBook[]
      );
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ---------- ISSUE BOOK ----------

  const handleIssueBook = async (data: IssueBookDTO) => {
    try {
      await api.post("/borrows", data);
      setShowIssueForm(false);
      loadPageData();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // ---------- RETURN BOOK / PAYMENT ----------

  const handleReturnBook = (borrow: Borrow) => {
    if (borrow.fine > 0) {
      setSelectedBorrow(borrow);
      setShowFineModal(true);
    } else {
      updateBorrowReturn(borrow._id);
    }
  };

  const updateBorrowReturn = async (borrowId: string) => {
    try {
      await api.patch(`/borrows/${borrowId}`, { status: "returned" });
      loadPageData();
    } catch (err) {
      alert((err as Error).message);
      // setError((err as Error).message);
    }
  };

  const handleFinePayment = async () => {
    if (!selectedBorrow) return;

    try {
      await api.post("/fines/pay-fine", {
        userId: selectedBorrow.userId._id,
        borrowId: selectedBorrow._id,
        amount: selectedBorrow.fine,
        method: paymentMethod,
      });

      setShowFineModal(false);
      loadPageData();
    } catch (err) {
      alert((err as Error).message);
      // setError((err as Error).message);
    }
  };

  // ---------- SEARCH ----------

  const handleUserSearch = async (q: string) => {
    setUserSearch(q);
    if (!q.trim()) return setUsers([]);

    const { data } = await api.get(`/users/search?name=${q}`);
    setUsers(data);
  };

  const handleBookSearch = async (q: string) => {
    setBookSearch(q);
    if (!q.trim()) return setBooks([]);

    const { data } = await api.get(`/books/search?title=${q}`);
    setBooks(data);
  };

  if (error) return <GlobalError message={error} onRetry={loadPageData} />;

  return (
    <div className="space-y-6 relative">
      {loading && <LoadingOverlay />}

      <div className="flex justify-between items-center">
        <p className="text-gray-600">Manage Borrow Records</p>
        <button
          onClick={() => setShowIssueForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Issue Book
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs">User</th>
              <th className="px-6 py-3 text-left text-xs">Book</th>
              <th className="px-6 py-3 text-left text-xs">Issued</th>
              <th className="px-6 py-3 text-left text-xs">Due</th>
              <th className="px-6 py-3 text-left text-xs">Returned</th>
              <th className="px-6 py-3 text-left text-xs">Status</th>
              <th className="px-6 py-3 text-left text-xs">Fine</th>
              <th className="px-6 py-3 text-left text-xs">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {borrows.map((b) => (
              <BorrowTableRow
                key={b._id}
                borrow={b}
                onReturn={handleReturnBook}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Issue Book Modal */}
      <IssueBookModal
        isOpen={showIssueForm}
        users={users}
        books={books}
        userSearch={userSearch}
        bookSearch={bookSearch}
        onClose={() => {
          setShowIssueForm(false);
          setBookSearch("");
          setUserSearch("");
        }}
        onSubmit={handleIssueBook}
        onUserSearch={handleUserSearch}
        onBookSearch={handleBookSearch}
        onSelectUser={(u) => {
          setUserSearch(`${u.name} (${u.email})`);
          setUsers([]);
        }}
        onSelectBook={(b) => {
          setBookSearch(`${b.title} — ${b.author}`);
          setBooks([]);
        }}
      />

      {/* Fine Payment Modal */}
      <FinePaymentModal
        isOpen={showFineModal}
        borrow={selectedBorrow}
        method={paymentMethod}
        onClose={() => setShowFineModal(false)}
        onPay={handleFinePayment}
        onMethodChange={(m) => setPaymentMethod(m)}
      />
    </div>
  );
};

export default Borrows;
