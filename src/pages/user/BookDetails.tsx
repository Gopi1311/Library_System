import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../congif/api";
import { BookSchema, type Book } from "../../validation/bookSchema";
import {
  BookmarkSquareIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  TagIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

const BookDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reserving, setReserving] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserId(parsed._id || parsed.id || "");
    }
    fetchBook();
  }, [id]);
  const fetchBook = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/books/${id}`);
      const validated = BookSchema.parse(res.data);
      setBook(validated);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!book || book.availableCopies === 0) return;

    try {
      setReserving(true);

      await api.post("/reservations", {
        userId,
        bookId: book._id,
      });

      alert("Book reserved successfully!");
      fetchBook();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setReserving(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading book details...
      </div>
    );

  if (error || !book)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-xl text-red-600 font-medium">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 underline"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-1" />
        Back
      </button>

      {/* Header */}
      <div className="flex items-start gap-6">
        <div className="p-5 bg-blue-600 text-white rounded-xl shadow">
          <BookOpenIcon className="w-12 h-12" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
          <p className="text-gray-600 text-lg mt-1">by {book.author}</p>

          <span
            className={`inline-block mt-4 px-4 py-1 rounded-full text-sm font-medium ${
              book.availableCopies > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {book.availableCopies > 0
              ? `${book.availableCopies} Copies Available`
              : "Not Available"}
          </span>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800">
            <IdentificationIcon className="w-5 h-5 text-blue-600" />
            Book Information
          </h3>

          <div className="space-y-3 text-sm">
            <p>
              <strong>ISBN:</strong> {book.isbn}
            </p>
            <p>
              <strong>Genre:</strong> {book.genre || "—"}
            </p>
            <p>
              <strong>Publisher:</strong> {book.publisher}
            </p>
            <p>
              <strong>Publication Year:</strong> {book.publicationYear}
            </p>
          </div>
        </div>

        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800">
            <TagIcon className="w-5 h-5 text-green-600" />
            Availability
          </h3>

          <div className="space-y-3 text-sm">
            <p>
              <strong>Total Copies:</strong> {book.totalCopies}
            </p>
            <p>
              <strong>Available:</strong>{" "}
              <span
                className={
                  book.availableCopies > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {book.availableCopies}
              </span>
            </p>
            <p>
              <strong>Shelf:</strong> {book.shelfLocation}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Summary</h3>
        <p className="text-gray-700 leading-relaxed">
          {book.summary || "No summary available."}
        </p>
      </div>

      {/* Reserve Button */}
      <button
        onClick={handleReserve}
        disabled={book.availableCopies === 0 || reserving}
        className={`w-full py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition-all ${
          book.availableCopies > 0
            ? "bg-green-600 hover:bg-green-700 text-white shadow"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        <BookmarkSquareIcon className="w-6 h-6" />
        {reserving ? "Reserving..." : "Reserve Book"}
      </button>
    </div>
  );
};

export default BookDetails;
