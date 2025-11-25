import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { BorrowUser, BorrowBook } from "../../../validation/borrowBookSchema";

import {
  IssueBookSchema,
  type IssueBookDTO,
} from "../../../validation/borrowBookSchema";

import { SearchSelect } from "../../common/SearchSelect";

interface IssueBookModalProps {
  isOpen: boolean;

  users: BorrowUser[];
  books: BorrowBook[];

  userSearch: string;
  bookSearch: string;

  onUserSearch: (q: string) => void;
  onBookSearch: (q: string) => void;

  onSelectUser: (user: BorrowUser) => void;
  onSelectBook: (book: BorrowBook) => void;

  onClose: () => void;
  onSubmit: (data: IssueBookDTO) => void;
}

const IssueBookModal: React.FC<IssueBookModalProps> = ({
  isOpen,
  users,
  books,
  userSearch,
  bookSearch,
  onUserSearch,
  onBookSearch,
  onSelectUser,
  onSelectBook,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    watch,
  } = useForm<IssueBookDTO>({
    resolver: zodResolver(IssueBookSchema),
    defaultValues: { userId: "", bookId: "", days: 14 },
  });

  const userId = watch("userId");
  const bookId = watch("bookId");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Issue New Book</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* USER SEARCH */}
          <SearchSelect
            label="Select User"
            placeholder="Search name/email..."
            searchValue={userSearch}
            results={users}
            displayField={(u) => `${u.name} — ${u.email}`}
            keyExtractor={(u) => u._id}
            onSearch={onUserSearch}
            onSelect={(u) => {
              onSelectUser(u);
              setValue("userId", u._id);
            }}
            error={errors.userId?.message}
          />

          {/* BOOK SEARCH */}
          <SearchSelect
            label="Select Book"
            placeholder="Search title/author..."
            searchValue={bookSearch}
            results={books}
            displayField={(b) => `${b.title} — ${b.author}`}
            keyExtractor={(b) => b._id}
            onSearch={onBookSearch}
            onSelect={(b) => {
              onSelectBook(b);
              setValue("bookId", b._id);
            }}
            error={errors.bookId?.message}
          />

          {/* DAYS */}
          <div>
            <label className="block text-gray-700">Borrow Duration</label>
            <input
              type="number"
              min={1}
              max={60}
              {...register("days", { valueAsNumber: true })}
              className="w-full border px-3 py-2 rounded-lg"
            />
            {errors.days && (
              <p className="text-red-600 text-sm">{errors.days.message}</p>
            )}
          </div>

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
              disabled={!userId || !bookId}
              className={`px-4 py-2 text-white rounded-lg ${
                userId && bookId
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Issue Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueBookModal;
