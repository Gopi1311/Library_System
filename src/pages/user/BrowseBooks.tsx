import React, { useState, useEffect } from "react";
import { api } from "../../congif/api";
import { BookSchema, type Book } from "../../validation/bookSchema";
import { LoadingOverlay } from "../../components/common/LoadingOverlay";
import { GlobalError } from "../../components/common/GlobalError";
import { z } from "zod";
import { Link } from "react-router-dom";
import { BookOpenIcon, BookmarkSquareIcon } from "@heroicons/react/24/outline";

const BrowseBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId,setUserId]=useState("6923fdc88ec3f845a24f4a35")

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/books/all");

      const validated = z.array(BookSchema).parse(data);
      setBooks(validated);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((b) =>
    [b.title, b.author, b.genre, b.isbn ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleReserve = async (bookId: string) => {
    try {
      await api.post("/reservations", {
        userId: userId, // TODO: Put logged-in user ID
        bookId,
      });
      alert("Book reserved successfully!");
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (error) return <GlobalError message={error} onRetry={fetchBooks} />;

  return (
    <div className="space-y-6 relative">
      {loading && <LoadingOverlay />}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Browse Books</h2>
        <p className="text-gray-600">Find & reserve books instantly</p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 shadow rounded-lg">
        <input
          type="text"
          placeholder="Search by title, author, genre, ISBN..."
          className="w-full border rounded-lg px-3 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Empty */}
      {books.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <h3 className="text-lg font-semibold">No books found</h3>
          <p>Books will appear here once added.</p>
        </div>
      ) : (
        /* Book Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition transform"
            >
              {/* Cover */}
              <div className="bg-indigo-600 p-4 flex justify-center">
                <BookOpenIcon className="w-12 h-12 text-white" />
              </div>

              {/* Details */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-700">by {book.author}</p>
                <p className="text-xs text-gray-500">Genre: {book.genre || "—"}</p>

                <div className="flex justify-between items-center pt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      book.availableCopies > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {book.availableCopies > 0
                      ? `${book.availableCopies} available`
                      : "Out of stock"}
                  </span>

                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {book.publicationYear}
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-3">
                  <Link
                    to={`/user/books/${book._id}`}
                    className="flex-1 bg-blue-200 text-black font-semibold py-2 text-center rounded-lg hover:bg-blue-300"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => handleReserve(book._id)}
                    disabled={book.availableCopies === 0}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg font-semibold ${
                      book.availableCopies > 0
                        ? "bg-green-200 hover:bg-green-300 text-black"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <BookmarkSquareIcon className="w-5 h-5" />
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseBooks;
