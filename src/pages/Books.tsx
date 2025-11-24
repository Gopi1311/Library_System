import React, { useState, useEffect } from "react";

import type { Book, BookFormDTO } from "../validation/bookSchema";
import { BookSchema } from "../validation/bookSchema";

import BookForm from "../components/BookForm";
import { api } from "../congif/api";
import { generateIsbn } from "../utils/generateRandomId ";
import { exportBooksToExcel } from "../utils/exportBooksToExcel";
import { LoadingOverlay } from "../components/common/LoadingOverlay";
import { GlobalError } from "../components/common/GlobalError";

import { z } from "zod";

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emptyForm: BookFormDTO = {
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    genre: "",
    publicationYear: new Date().getFullYear(),
    totalCopies: 1,
    availableCopies: 1,
    shelfLocation: "",
    summary: "",
  };

  const [formDefaults, setFormDefaults] = useState<BookFormDTO>(emptyForm);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    try {
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

  const handleSubmit = async (data: BookFormDTO) => {
    try {
      if (editingBook) {
        const payload = { ...data };
        delete payload.isbn;
        delete payload.availableCopies;

        await api.put(`/books/${editingBook._id}`, payload);
      } else {
        const createPayload = data;
        await api.post("/books", createPayload);
      }

      setShowForm(false);
      setEditingBook(null);
      setFormDefaults(emptyForm);
      fetchBooks();

    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);

    setFormDefaults({
      title: book.title,
      author: book.author,
      publisher: book.publisher ?? "",
      genre: book.genre ?? "",
      publicationYear: book.publicationYear,
      totalCopies: book.totalCopies,
      shelfLocation: book.shelfLocation ?? "",
      summary: book.summary ?? "",

      isbn: "", // hidden in edit
      availableCopies: undefined,
    });

    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      const res = await api.delete(`/books/${id}`);
      alert(res.data.message);
      fetchBooks();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const filteredBooks = books.filter((b) =>
    [b.title, b.author, b.isbn ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <GlobalError message={error} onRetry={fetchBooks} />;
  }

  return (
    <div className="space-y-6 relative">
      {loading && <LoadingOverlay />}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Manage your library collection</p>

        {!(books.length === 0 && !loading) && (
          <div className="flex gap-3">
            <button
              onClick={() => exportBooksToExcel(books)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Export Excel
            </button>

            <button
              onClick={() => {
                setEditingBook(null);
                setFormDefaults({
                  ...emptyForm,
                  isbn: generateIsbn(),
                });
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Add Book
            </button>
          </div>
        )}
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 shadow rounded-lg">
        <input
          type="text"
          placeholder="Search by title, author, ISBN..."
          className="w-full border rounded-lg px-3 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* EMPTY */}
      {books.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          <h2 className="text-xl font-semibold">No Books Available</h2>
          <p className="text-gray-500 mb-4">Add new books to build your library collection.</p>

          <button
            onClick={() => {
              setEditingBook(null);
              setFormDefaults({
                ...emptyForm,
                isbn: generateIsbn(),
              });
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Book
          </button>
        </div>
      ) : (
        // BOOKS GRID
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white shadow border rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="white"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-14 w-14"
                  strokeWidth="1.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m0 0l3-3m-3 3l-3-3m6-6V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h3" />
                </svg>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-700">by {book.author}</p>
                <p className="text-xs text-gray-500 mb-3">Shelf: {book.shelfLocation}</p>

                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      book.availableCopies > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {book.availableCopies} available
                  </span>

                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    Year: {book.publicationYear}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(book._id)}
                    className="flex-1 bg-red-50 text-red-700 py-2 rounded-lg hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM */}
      {showForm && (
        <BookForm
          defaultValues={formDefaults}
          editingBook={!!editingBook}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Books;
