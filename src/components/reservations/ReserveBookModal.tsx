import React from "react";
import type { User, Book } from "../../types";

interface ReserveBookModalProps {
  isOpen: boolean;

  users: User[];
  books: Book[];

  userSearch: string;
  bookSearch: string;

  selectedUserId: string;
  selectedBookId: string;

  onUserSearch: (q: string) => void;
  onBookSearch: (q: string) => void;

  onSelectUser: (user: User) => void;
  onSelectBook: (book: Book) => void;

  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ReserveBookModal: React.FC<ReserveBookModalProps> = ({
  isOpen,
  users,
  books,
  userSearch,
  bookSearch,
  selectedUserId,
  selectedBookId,
  onUserSearch,
  onBookSearch,
  onSelectUser,
  onSelectBook,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Reserve Book</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* USER SEARCH */}
          <div className="relative">
            <label className="block text-gray-700 mb-1">Search User</label>

            <input
              value={userSearch}
              onChange={(e) => onUserSearch(e.target.value)}
              placeholder="Search user name/email..."
              className="w-full border px-3 py-2 rounded-lg"
            />

            {userSearch && users.length > 0 && (
              <ul className="absolute w-full bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg z-50">
                {users.map((u) => (
                  <li
                    key={u._id}
                    onClick={() => onSelectUser(u)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {u.name} — {u.email}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* BOOK SEARCH */}
          <div className="relative">
            <label className="block text-gray-700 mb-1">Search Book</label>

            <input
              value={bookSearch}
              onChange={(e) => onBookSearch(e.target.value)}
              placeholder="Search book title/author..."
              className="w-full border px-3 py-2 rounded-lg"
            />

            {bookSearch && books.length > 0 && (
              <ul className="absolute w-full bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg z-50">
                {books.map((b) => (
                  <li
                    key={b._id}
                    onClick={() => onSelectBook(b)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {b.title} — {b.author}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!selectedUserId || !selectedBookId}
              className={`px-4 py-2 rounded-lg text-white ${
                selectedUserId && selectedBookId
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Reserve Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReserveBookModal;
